// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract DropCollection is ERC721, ERC721Enumerable, AccessControl, ERC2981{
    using SafeMath for uint256;

    mapping(address => uint256) private _mintCount;
    bytes32 private _merkleRoot;
    string private _tokenBaseURI;
    address public _treasury;
    uint256 internal _totalRevenue; 
    
    // Sales Parameters
    uint256 private _maxAmount;
    uint256 private _maxPerMint;
    uint256 private _maxPerWallet;
    uint256 private _price;

    // States
    bool private _presaleActive = false;
    bool private _saleActive = false;


    constructor(
        string memory name_,
        string memory symbol_,
        address treasury_,
        address royalty_,
        uint96 royaltyFee_
        ) ERC721(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); 
        _setDefaultRoyalty(royalty_, royaltyFee_);
        _treasury=treasury_;
    }

    modifier onlyMintable(uint64 quantity) {
        require(quantity > 0, "Quantity is 0");
        require(
            _maxAmount > 0 ? totalSupply().add(quantity) <= _maxAmount : true,
            "Exceeded max supply"
        );
        require(quantity <= _maxPerMint, "Exceeded max per mint");
        _;
    }
               
    function mint(uint64 quantity) external payable onlyMintable(quantity) {
        require(!_presaleActive, "Presale active");
        require(_saleActive, "Sale not active");
        require(
            _mintCount[_msgSender()].add(quantity) <= _maxPerWallet,
            "Exceeded max per wallet"
        );

        _purchaseMint(quantity, _msgSender());
    }

    function mintTo(address recipient, uint64 quantity)
        external
        payable
        onlyMintable(quantity)
    {
        require(!_presaleActive, "Presale active");
        require(_saleActive, "Sale not active");
        require(
            _mintCount[recipient].add(quantity) <= _maxPerWallet,
            "Exceeded max per wallet"
        );

        _purchaseMint(quantity, recipient);
    }

    function presaleMint(
        uint64 quantity,
        uint256 allowed, 
        bytes32[] calldata proof 
    ) external payable onlyMintable(quantity) {
        uint256 mintQuantity = _mintCount[_msgSender()].add(quantity);
        require(_presaleActive, "Presale not active");
        require(_merkleRoot != "", "Presale not set");
        require(mintQuantity <= _maxPerWallet, "Exceeded max per wallet");
        require(mintQuantity <= allowed, "Exceeded max per wallet");
        require(
            MerkleProof.verify(
                proof,
                _merkleRoot,
                keccak256(abi.encodePacked(_msgSender(), allowed))
            ),
            "Presale invalid"
        );      

        _purchaseMint(quantity, _msgSender());
    }

    function presaleMintTo(
        address recipient,
        uint64 quantity,
        uint256 allowed,
        bytes32[] calldata proof
    ) external payable onlyMintable(quantity) {
        uint256 mintQuantity = _mintCount[recipient].add(quantity);
        require(_presaleActive, "Presale not active");
        require(_merkleRoot != "", "Presale not set");
        require(mintQuantity <= _maxPerWallet, "Exceeded max per wallet");
        require(mintQuantity <= allowed, "Exceeded max per wallet");
        require(
            MerkleProof.verify(
                proof,
                _merkleRoot,
                keccak256(abi.encodePacked(recipient, allowed))
            ),
            "Presale invalid"
        );

        _purchaseMint(quantity, recipient);
    }

    function batchAirdrop(
        uint64[] calldata quantities,
        address[] calldata recipients
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 length = recipients.length;
        require(quantities.length == length, "Invalid Arguments");

        for (uint256 i = 0; i < length; ) {
            _mint(quantities[i], recipients[i]);
            unchecked {
                i++;
            }
        }
    }

    function setMerkleRoot(bytes32 newRoot)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _merkleRoot = newRoot;
    }

    function startSale(
        uint256 newMaxAmount,
        uint256 newMaxPerMint,
        uint256 newMaxPerWallet,
        uint256 newPrice,
        bool presale
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _saleActive = true;
        _presaleActive = presale;

        _maxAmount = newMaxAmount;
        _maxPerMint = newMaxPerMint;
        _maxPerWallet = newMaxPerWallet;
        _price = newPrice;
    }

    function stopSale() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _saleActive = false;
        _presaleActive = false;
    }

    function setBaseURI(string memory newBaseURI)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _tokenBaseURI = newBaseURI;
    }

    function burn(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(Address.isContract(_msgSender()), "Not Allowed");
        _burn(tokenId);
    }

    function maxAmount() external view returns (uint256) {
        return _maxAmount;
    }

    function maxPerMint() external view returns (uint256) {
        return _maxPerMint;
    }

    function maxPerWallet() external view returns (uint256) {
        return _maxPerWallet;
    }

    function price() external view returns (uint256) {
        return _price;
    }

    function presaleActive() external view returns (bool) {
        return _presaleActive;
    }

    function saleActive() external view returns (bool) {
        return _saleActive;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _tokenBaseURI;
    }
    
    function totalRevenue() external view returns (uint256) {
        return _totalRevenue;
    }

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(address(this).balance > 0, "0 balance");
        uint256 balance = address(this).balance;
        Address.sendValue(payable(_treasury),balance);
    }

    function _purchaseMint(uint64 quantity, address to) internal {
        require(_price.mul(quantity) <= msg.value, "Value incorrect");

        unchecked {
            _totalRevenue = _totalRevenue.add(msg.value);
            _mintCount[to] = _mintCount[to].add(quantity);
        }

        _mint(quantity, to);
    }

    function _mint(uint64 quantity, address to) internal {
        for (uint64 i = 0; i < quantity; ) {
            _safeMint(to, totalSupply().add(1));
            unchecked {
                i++;
            }
        }
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    )
        internal
        virtual
        override(ERC721,ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId,batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721,ERC721Enumerable, AccessControl, ERC2981)
        returns (bool)
    {
        return interfaceId == 0x2a55205a || super.supportsInterface(interfaceId);
    }

}