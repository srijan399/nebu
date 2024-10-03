// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NameAndFavoriteNumber {
    struct UserData {
        string name;
        uint favoriteNumber;
    }

    // Mapping to store user data based on the user's address
    mapping(address => UserData[]) public users;

    // Function to set user's name and favorite number
    function setUserData(string memory _name, uint _favoriteNumber) public {
        users[msg.sender].push(UserData(_name, _favoriteNumber));
    }

    // Function to get user's name and favorite number
    function getUserData(address _user) public view returns (UserData[] memory) {
        return users[_user];
    }
}
