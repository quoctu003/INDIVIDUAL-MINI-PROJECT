// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RoomAccess {
    address public immutable admin;
    mapping(bytes32 => bool) private rooms;
    mapping(bytes32 => mapping(address => bool)) private permissions;

    event RoomCreated(string room, address indexed by);
    event AccessGranted(string room, address indexed user, address indexed by);
    event AccessRevoked(string room, address indexed user, address indexed by);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function roomKey(string memory room) internal pure returns (bytes32) {
        require(bytes(room).length > 0, "Room name required");
        return keccak256(bytes(room));
    }

    function createRoom(string calldata room) external onlyAdmin {
        bytes32 key = roomKey(room);
        require(!rooms[key], "Room already exists");
        rooms[key] = true;
        emit RoomCreated(room, msg.sender);
    }

    function roomExists(string calldata room) external view returns (bool) {
        if (bytes(room).length == 0) return false;
        return rooms[keccak256(bytes(room))];
    }

    function grantAccess(string calldata room, address user) external onlyAdmin {
        bytes32 key = roomKey(room);
        require(rooms[key], "Room does not exist");
        require(user != address(0), "Invalid user");
        require(!permissions[key][user], "Already granted");
        permissions[key][user] = true;
        emit AccessGranted(room, user, msg.sender);
    }

    function revokeAccess(string calldata room, address user) external onlyAdmin {
        bytes32 key = roomKey(room);
        require(rooms[key], "Room does not exist");
        require(permissions[key][user], "Not granted");
        permissions[key][user] = false;
        emit AccessRevoked(room, user, msg.sender);
    }

    function hasAccess(string calldata room, address user) external view returns (bool) {
        if (bytes(room).length == 0) return false;
        bytes32 key = keccak256(bytes(room));
        return rooms[key] && (user == admin || permissions[key][user]);
    }
}
