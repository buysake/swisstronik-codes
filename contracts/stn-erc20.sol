pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract STNERC20 is ERC20, Ownable {
  constructor(address owner) ERC20("StnErc20", "STNERC20") Ownable(owner) {}
    
  function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
  }
}
