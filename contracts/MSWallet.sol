pragma solidity ^0.8.4;

contract MSWallet {
    event Deposit(address indexed _sender, uint256 _amount, uint256 _balance);
    event Submit(
        address indexed _owner,
        uint256 indexed _txIndex,
        address indexed _to,
        uint256 _value,
        bytes data
    );
    event Confirm(address indexed _owner, uint256 indexed _txIndex);
    event Revoke(address indexed _owner, uint256 indexed _txIndex);
    event Execute(address indexed _owner, uint256 indexed _txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
    }

    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        require(_owners.length > 0, "Owners count needs to be at least 1");
        require(
            _numConfirmationsRequired > 0,
            "Number of confirmations required should be at least 1"
        );
        require(
            _numConfirmationsRequired <= _owners.length,
            "Number of confirmations required should less than owners"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Owner is invalid");
            require(!isOwner[owner], "Owner is not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "You are not an owner");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(
            !transactions[_txIndex].executed,
            "Transaction is already executed"
        );
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(
            !isConfirmed[_txIndex][msg.sender],
            "Transaction is already confirmed"
        );
        _;
    }

    function submit(
        address _to,
        uint256 _value,
        bytes memory _data
    ) public onlyOwner {
        uint256 txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );

        emit Submit(msg.sender, txIndex, _to, _value, _data);
    }

    function confirm(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        isConfirmed[_txIndex][msg.sender] = true;
        transactions[_txIndex].numConfirmations += 1;

        emit Confirm(msg.sender, _txIndex);
    }

    function execute(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "Num confirmations required is not met"
        );

        transaction.executed = true;
        (bool success, ) =
            transaction.to.call{value: transaction.value}(transaction.data);

        require(success, "Failed to transfer funds");

        emit Execute(msg.sender, _txIndex);
    }

    function revoke(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        isConfirmed[_txIndex][msg.sender] = false;
        transactions[_txIndex].numConfirmations -= 1;

        emit Revoke(msg.sender, _txIndex);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }
}
