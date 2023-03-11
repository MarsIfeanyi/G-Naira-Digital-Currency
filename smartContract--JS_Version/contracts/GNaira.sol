// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * ==================
 * LIBRARY
 * ==================
 */

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;
        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        return c;
    }
}

/**
 * ==================
 * #G-NAIRA CONTRACT
 * ==================
 */

contract GNaira is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    /**
     * ==================
     *  STATE VARIABLES
     * ==================
     */

    uint256 public constant MAX_SUPPLY = 1000000000 * 10 ** 18;
    uint256 public totalSupply_;
    uint256 public requiredSignatures; // for MultiSigWallet

    address public governor;
    address[] public signers; // dynamic array of signers

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
    mapping(address => bool) public blacklisted; // the default value of bool is "false"
    mapping(address => bool) public minters;
    mapping(address => bool) public burners;

    /**
     * ==================
     * EVENTS
     * ==================
     */
    // event Transfer(address indexed from, address indexed to, uint256 value);
    // event Approval(
    //     address indexed owner,
    //     address indexed spender,
    //     uint256 value
    // );

    /**
     * ==================
     * MODIFIERS
     * ==================
     */

    modifier sufficientBalance(address _spender, uint256 amount) {
        require(
            amount <= balances[_spender],
            "Insufficient Balance to make transaction"
        );

        _;
    }

    modifier validAddress(address _address01, address _address02) {
        require(_address01 != address(0), "Invalid address");
        require(_address02 != address(0), "Invalid address");
        _;
    }

    modifier notBlacklisted(address sender, address recipient) {
        require(
            !blacklisted[sender] && !blacklisted[recipient],
            "BlackListed!!!: Token transfer not allowed"
        );
        _;
    }

    modifier onlyGovernor() {
        require(msg.sender == governor, "You are not the Governor");
        _;
    }

    /**
     * ==================
     * FUNCTIONS
     * ==================
     */

    // Constructor function to Initialize contract's state
    constructor() ERC20("#G-Naira", "gNGN") {
        uint256 initialSupply = 100000000 * 10 ** decimals();
        _mint(msg.sender, initialSupply);
        totalSupply_ = initialSupply;
        balances[msg.sender] = totalSupply_;

        governor = msg.sender;
        minters[msg.sender] = true;
        burners[msg.sender] = true;
    }

    // function that returns the totalSupply of the #G-Naira token currency after deployment
    function totalSupply() public view override returns (uint256) {
        return totalSupply_;
    }

    // function that returns the balance of an addresss in the "balances mapping
    function balanceOf(address account) public view override returns (uint256) {
        return balances[account];
    }

    // function that allows user to transfer the token currency. if a user is "Blacklisted" by the Governor, then this function cannot be executed.
    function transfer(
        address recipient,
        uint256 amount
    )
        public
        override
        sufficientBalance(msg.sender, amount)
        validAddress(msg.sender, recipient)
        notBlacklisted(msg.sender, recipient)
        returns (bool)
    {
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[recipient] = balances[recipient].add(amount);

        //Emits an event upon successful transfer. Events are written to the blockchain log.
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // function to allow an owner i.e. msg.sender to approve a delegate(spender) account to withdraw tokens from his account and to transfer them to other accounts.
    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual override validAddress(owner, spender) {
        allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    // function that returns the current approved number of tokens by an owner to a specific delegate (spender), as set in the approve function.
    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        return allowances[owner][spender];
    }

    // function that allows a delegate(sender) approved for withdrawal to transfer owner funds to a third-party account
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override notBlacklisted(sender, recipient) returns (bool) {
        require(amount <= balances[sender]);
        require(amount <= allowances[sender][msg.sender]);

        balances[sender] = balances[sender].sub(amount);
        allowances[sender][msg.sender] = allowances[sender][msg.sender].sub(
            amount
        );
        balances[recipient] = balances[recipient].add(amount);

        emit Transfer(sender, recipient, amount);
        return true;
    }

    // function to  Mint new token currency. Only the "Governor" can execute this function. If a user (sender or recipient) is blacklisted, then this function cannot be exeuted.
    function mintTokenCurrency(
        address payable recipient,
        uint256 amount
    ) public notBlacklisted(msg.sender, recipient) onlyGovernor {
        // checks to ensure that the address provided is not a zero address
        require(recipient != address(0), "Invalid: mint to the zero address");

        require(minters[msg.sender], "Only Governor can mint tokens");
        // checks to ensure that tokenTotalSupply is lessthan Maximum supply. You cannot mint if tokenTotalSupply is equal to Maximum supply
        require(
            totalSupply_.add(amount) <= MAX_SUPPLY,
            "Total supply cannot exceed maximum supply"
        );

        totalSupply_ = totalSupply_.add(amount);
        balances[recipient] = balances[recipient].add(amount);

        emit Transfer(address(0), recipient, amount);
    }

    function mint(address to, uint256 amount) public onlyMinter {
        require(
            totalSupply().add(amount) <= MAX_SUPPLY,
            "Total supply exceeded"
        );
        _mint(to, amount);
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "You are not a minter");
        _;
    }

    // function to Burn some amount token currency.  Only the "Governor" can execute this function.
    function burnTokenCurrency(
        address account,
        uint256 amount
    ) public nonReentrant sufficientBalance(msg.sender, amount) onlyGovernor {
        require(account != address(0), "ERC20: burn from the zero address");
        require(burners[msg.sender], "Only Governor can burn tokens");

        balances[account] -= amount;
        totalSupply_ -= amount;
        emit Transfer(account, address(0), amount);
    }

    // function that Blacklists addresse/s to prevent them from sending and receiving token currency.  Only the "Govenor" can execute this function
    function blacklistAddress(address account) public onlyGovernor {
        blacklisted[account] = true;
    }

    // function that unBlacklists addresses to allow them to send and receive token currency.   Only the "Govenor" can execute this function
    function unblacklistAddress(address account) public onlyGovernor {
        blacklisted[account] = false;
    }

    // function another address and give them right to mint token currency
    function addMinter(address account) public onlyGovernor {
        minters[account] = true;
    }

    function removeMinter(address account) public onlyGovernor {
        minters[account] = false;
    }

    function addBurner(address account) public onlyGovernor {
        burners[account] = true;
    }

    function removeBurner(address account) public onlyGovernor {
        burners[account] = false;
    }

    // function to transfer ownership and set new "Governor", who can Mint, Burn tokens and blacklist an address
    function setGovernor(address newGovernor) public onlyGovernor {
        governor = newGovernor;
        minters[newGovernor] = true;
        burners[newGovernor] = true;
    }

    // function that sets MultiSigWallet to secure Burning and Minting of token currency
    function setMultiSigWallet(
        address[] memory _signers,
        uint256 _requiredSignatures
    ) public onlyGovernor {
        require(
            _signers.length > 0,
            "Multi-signature wallet must have at least one signer"
        );
        require(
            _requiredSignatures <= _signers.length,
            "Required signatures cannot exceed number of signers"
        );
        signers = _signers;
        requiredSignatures = _requiredSignatures;
    }

    // function to mint token Currency by using MultiSig.
    function multiSigMint(address to, uint256 amount) public nonReentrant {
        require(signers.length > 0, "Multi-signature wallet");
        require(minters[msg.sender], "Only Signers can mint tokens");
        // checks to ensure that totalSupply is not more than the maximum supply of the token
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "Total supply cannot exceed maximum supply"
        );

        uint256 approvals = 2;
        for (uint256 i = 0; i < signers.length; i++) {
            if (
                minters[signers[i]] &&
                allowances[address(this)][signers[i]] >= amount
            ) {
                approvals++;
            }
        }
        require(approvals >= requiredSignatures, "Insufficient approvals");

        for (uint256 i = 0; i < signers.length; i++) {
            if (minters[signers[i]]) {
                transferFrom(signers[i], address(this), amount);
            }
        }

        mintTokenCurrency(payable(to), amount);
    }

    // function to Burn token Currency by using MultiSig.
    function multiSigBurn(address to, uint256 amount) public nonReentrant {
        require(signers.length > 0, "Multi-signature wallet");
        require(burners[msg.sender], "Only Signers can burn tokens");
        // checks to ensure that totalSupply is not more than the maximum supply of the token

        uint256 approvals = 2;
        for (uint256 i = 0; i < signers.length; i++) {
            if (
                burners[signers[i]] &&
                allowances[address(this)][signers[i]] >= amount
            ) {
                approvals++;
            }
        }
        require(approvals >= requiredSignatures, "Insufficient approvals");

        for (uint256 i = 0; i < signers.length; i++) {
            if (burners[signers[i]]) {
                transferFrom(signers[i], address(this), amount);
            }
        }

        burnTokenCurrency(payable(to), amount);
    }
}
