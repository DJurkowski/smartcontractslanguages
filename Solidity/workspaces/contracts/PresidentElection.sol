// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "hardhat/console.sol";

contract PresidentElection {

  struct PresidentCandidate {
    string name;
    bytes32 byteName;
    uint numberOfVotes;
  }

  struct Citizen {
    uint voteIdentifier;
    bool isVoted;
    bool isCitizenCanVote;
  }

  address public validator;

  mapping(address => Citizen) public citizens;

  PresidentCandidate[] public candidates;

  constructor(string[] memory candidatesNames) {
    validator = msg.sender;
    citizens[validator].isCitizenCanVote = true;

    for (uint i = 0; i < candidatesNames.length; i++) {
      isCandidateAlreadyInArray(candidatesNames[i]);
    }
  }

  function isCandidateAlreadyInArray(string memory candidateName) private {
      bool isDuplication = false;
      for (uint i = 0; i < candidates.length; i++) {
        if(compareStringUsingBytes(candidates[i].name, candidateName)) {
            isDuplication = true;
        }
      }

      if(!isDuplication) {
        candidates.push(PresidentCandidate({
            name: candidateName,
            byteName: stringToBytesConverter(candidateName),
            numberOfVotes: 0
        }));
      }
  }

  function compareStringUsingBytes(string memory value1, string memory value2) public pure returns(bool){
        return keccak256(abi.encodePacked(value1)) == keccak256(abi.encodePacked(value2));
    }

  function stringToBytesConverter(string memory value) public pure returns (bytes32 byteValue) {
    bytes memory temp = bytes(value);
    if (temp.length == 0) {
        return 0x0;
    }

    assembly {
        byteValue := mload(add(value, 32))
    }
  }
    
  function verifyCitizen(address citizenAddress) public {
    require(
      msg.sender == validator,
      "Only validator can give right to vote."
    );
    require(
      !citizens[citizenAddress].isVoted,
      "The citizen already voted."
    );
    require(citizens[citizenAddress].isCitizenCanVote == false);
    citizens[citizenAddress].isCitizenCanVote = true;
  }

  function displayListOfCandidates() public {
      for (uint i = 0; i < candidates.length; i++) {
          console.log(i, ". ", candidates[i].name);
      }
  }

  function vote(uint candidatesId) public {
    Citizen storage sender = citizens[msg.sender];
    require(sender.isCitizenCanVote, "Citizen doesn't have right to vote");
    require(!sender.isVoted, "Citizen already voted.");
    sender.isVoted = true;
    sender.voteIdentifier = candidatesId;
    candidates[candidatesId].numberOfVotes += 1;
  }

  function calculateVotes() public view returns (uint newPresidentId_) {
    uint winningVoteCount = 0;
    for (uint p = 0; p < candidates.length; p++) {
      if (candidates[p].numberOfVotes > winningVoteCount) {
        winningVoteCount = candidates[p].numberOfVotes;
        newPresidentId_ = p;
      }
    }
  }

  function newPresident() public view returns (string memory newPresident_) {
    newPresident_ = candidates[calculateVotes()].name;
  }

}