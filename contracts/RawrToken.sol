// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TokenBase.sol";

contract RawrToken is TokenBase {
    constructor(string memory name, string memory symbol, uint256 initialSupply) TokenBase(name, symbol, initialSupply) {
    }
}