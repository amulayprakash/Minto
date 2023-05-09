// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDropKitPass {
    struct FeeEntry {
        uint96 value;
        bool isValue;
    }

    struct PricingEntry {
        uint256 price;
        bool isValue;
    }

    struct TokenEntry {
        uint256 tokenId;
        bool isValue;
    }

    event PassOptionCreated(
        uint256 indexed stageId,
        uint96 indexed feeRate,
        uint256 indexed price
    );

    event PassOptionUpdated(
        uint256 indexed stageId,
        uint96 indexed feeRate,
        uint256 indexed price,
        bool isValue
    );

    event PassOptionRedeemed(
        uint256 indexed stageId,
        uint96 indexed feeRate,
        bytes32 indexed data
    );

    event PassOptionPurchased(uint256 indexed stageId, uint96 indexed feeRate);

    event PassActivated(uint256 indexed tokenId, address indexed owner);

    event PassDeactivated(uint256 indexed tokenId, address indexed owner);

    event SaleStarted(
        uint256 indexed stageId,
        uint256 maxAmount,
        uint256 maxPerWallet,
        uint256 maxPerMint,
        bool presale
    );

    event SaleStopped(uint256 indexed stageId);

    event PassMemberAdded(uint256 indexed tokenId, address indexed member);

    event PassMemberRemoved(uint256 indexed tokenId, address indexed member);

    event PassUpgraded(
        uint256 indexed tokenId,
        uint256 indexed newStageId,
        uint256 indexed newFeeRate
    );

    event UpgradePathSet(
        uint256 indexed stageId,
        uint96 indexed feeRate,
        uint256 newStageId,
        uint96 newFeeRate,
        uint256 price,
        bool active
    );

    /**
     * @dev Batch mints feeRate tokens for a given stage
     */
    function batchAirdrop(
        uint256 stageId,
        address[] calldata recipients,
        uint96[] calldata feeRates
    ) external;

    /**
     * @dev Gets the fee rate for a given token id
     */
    function getFeeRate(uint256 tokenId) external view returns (uint96);

    /**
     * @dev Gets the fee rate for a given address
     */
    function getFeeRateOf(address owner) external view returns (uint96);
}