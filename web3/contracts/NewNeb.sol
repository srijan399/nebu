// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NewNebula {}

// contract Nebula {
//     /* Errors */
//     error Nebula__DeadlineMustBeInTheFuture();
//     error Nebula__TransferFailed();
//     error Nebula__NotOwner();
//     error Nebula__GoalNotReached();
//     error Nebula__MilestoneAlreadyApproved();
//     error Nebula__MilestoneNotApproved();

//     struct Funders {
//         address funder;
//         uint256 amount;
//     }

//     struct Milestone {
//         string description;
//         uint256 fundingRequired;
//         uint256 votesFor;
//         uint256 votesAgainst;
//         bool approved;
//         bool fundsReleased;
//     }

//     struct Campaign {
//         address owner;
//         string name;
//         uint256 goal;
//         uint256 deadline;
//         uint256 raised;
//         string description;
//         string image;
//         Funders[] funders;
//         Milestone[] milestones;
//         mapping(address => uint256) contributions;
//         mapping(uint256 => mapping(address => bool)) milestoneVotes; // Track if a user has voted for a milestone
//     }

//     mapping(uint256 => Campaign) public campaigns;

//     uint256 public s_campaignCount = 0;

//     /* Modifiers */
//     modifier OnlyOwner(uint256 _campaignId) {
//         Campaign storage campaign = campaigns[_campaignId];
//         if (campaign.owner != msg.sender) {
//             revert Nebula__NotOwner();
//         }
//         _;
//     }

//     /* Campaign Creation */
//     function createCampaign(
//         string memory _name,
//         uint256 _goal,
//         uint256 _deadline,
//         string memory _description,
//         string memory _image,
//         address _owner,
//         string[] memory _milestoneDescriptions,
//         uint256[] memory _milestoneFundingRequired
//     ) public {
//         if (_deadline < block.timestamp) {
//             revert Nebula__DeadlineMustBeInTheFuture(); // Less Gas Consumption than require
//         }

//         require(
//             _milestoneDescriptions.length == _milestoneFundingRequired.length,
//             "Milestone data mismatch"
//         );

//         Campaign storage newCampaign = campaigns[s_campaignCount];
//         newCampaign.owner = _owner;
//         newCampaign.name = _name;
//         newCampaign.goal = _goal;
//         newCampaign.deadline = _deadline;
//         newCampaign.description = _description;
//         newCampaign.image = _image;

//         for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
//             newCampaign.milestones.push(
//                 Milestone({
//                     description: _milestoneDescriptions[i],
//                     fundingRequired: _milestoneFundingRequired[i],
//                     votesFor: 0,
//                     votesAgainst: 0,
//                     approved: false,
//                     fundsReleased: false
//                 })
//             );
//         }

//         s_campaignCount++;
//     }

//     /* Fund Campaign */
//     function fundCampaign(uint256 _campaignId) public payable {
//         uint256 _amount = msg.value;
//         Campaign storage campaign = campaigns[_campaignId];

//         if (campaign.raised + _amount > campaign.goal) {
//             payable(msg.sender).transfer(
//                 uint256(campaign.raised + _amount - campaign.goal)
//             );
//             _amount = campaign.goal - campaign.raised;
//         }

//         campaign.raised += _amount;
//         campaign.funders.push(Funders(msg.sender, _amount));
//         campaign.contributions[msg.sender] += _amount;
//     }

//     /* Vote on Milestones */
//     function voteOnMilestone(
//         uint256 _campaignId,
//         uint256 _milestoneId,
//         bool voteFor
//     ) public {
//         Campaign storage campaign = campaigns[_campaignId];
//         Milestone storage milestone = campaign.milestones[_milestoneId];

//         require(
//             campaign.contributions[msg.sender] > 0,
//             "No contribution to vote"
//         );
//         require(
//             !campaign.milestoneVotes[_milestoneId][msg.sender],
//             "Already voted on this milestone"
//         );
//         require(!milestone.approved, "Milestone already approved");

//         uint256 votingPower = campaign.contributions[msg.sender];

//         if (voteFor) {
//             milestone.votesFor += votingPower;
//         } else {
//             milestone.votesAgainst += votingPower;
//         }

//         campaign.milestoneVotes[_milestoneId][msg.sender] = true;

//         // Check if the milestone has reached majority approval
//         if (milestone.votesFor > milestone.votesAgainst) {
//             milestone.approved = true;
//         }
//     }

//     /* Withdraw funds for a specific milestone */
//     function withdrawMilestoneFunds(uint256 _campaignId, uint256 _milestoneId)
//         public
//         OnlyOwner(_campaignId)
//     {
//         Campaign storage campaign = campaigns[_campaignId];
//         Milestone storage milestone = campaign.milestones[_milestoneId];

//         if (!milestone.approved || milestone.fundsReleased) {
//             revert Nebula__MilestoneNotApproved();
//         }

//         (bool success, ) = payable(msg.sender).call{
//             value: milestone.fundingRequired
//         }("");
//         if (!success) {
//             revert Nebula__TransferFailed();
//         }

//         milestone.fundsReleased = true;
//     }

//     /* Getter Functions */
//     function getCampaigns() public view returns (Campaign[] memory) {
//         Campaign[] memory allCampaigns = new Campaign[](s_campaignCount);
//         uint256 copyofCampaignCount = s_campaignCount;
//         for (uint256 i = 0; i < copyofCampaignCount; i++) {
//             allCampaigns[i] = campaigns[i];
//         }
//         return allCampaigns;
//     }

//     function getMyCampaigns(address _owner)
//         public
//         view
//         returns (Campaign[] memory)
//     {
//         Campaign[] memory myCampaigns = new Campaign[](s_campaignCount);
//         uint256 count = 0;
//         uint256 copyofCampaignCount = s_campaignCount;
//         for (uint256 i = 0; i < copyofCampaignCount; i++) {
//             if (campaigns[i].owner == _owner) {
//                 myCampaigns[count] = campaigns[i];
//                 count++;
//             }
//         }
//         return myCampaigns;
//     }

//     function getMilestones(uint256 _campaignId)
//         public
//         view
//         returns (Milestone[] memory)
//     {
//         return campaigns[_campaignId].milestones;
//     }
// }
