// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NameAndFavoriteNumber {
    /* Errors */
    error Nebula__DeadlineMustBeInTheFuture();

    struct Funders {
        address funder;
        uint256 amount;
    }

    struct Campaign {
        address owner;
        string name;
        uint256 goal;
        uint256 deadline;
        uint256 raised;
        string description;
        string image;
        Funders[] funders;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public s_campaignCount = 0;

    function createCampaign(
        string memory _name,
        uint256 _goal,
        uint256 _deadline,
        string memory _description,
        string memory _image,
        address _owner
    ) public {
        if(_deadline < block.timestamp) {
            revert Nebula__DeadlineMustBeInTheFuture();
        }

        Campaign storage newCampaign = campaigns[s_campaignCount];

        newCampaign.owner = _owner;
        newCampaign.name = _name;
        newCampaign.goal = _goal;
        newCampaign.deadline = _deadline;
        newCampaign.description = _description;
        newCampaign.image = _image;

        s_campaignCount++;
    }

    function fundCampaign(uint256 _campaignId) public payable {
        uint256 _amount = msg.value;
        Campaign storage campaign = campaigns[_campaignId];

        if(campaign.raised + _amount > campaign.goal) {
            payable(msg.sender).transfer(uint256(campaign.raised + _amount - campaign.goal));
            _amount = campaign.goal - campaign.raised;
        }

        campaign.raised += _amount;
        campaign.funders.push(Funders(msg.sender, _amount));
    }

    /** Getter Functions */
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](s_campaignCount);
        for (uint256 i = 0; i < s_campaignCount; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }
}
