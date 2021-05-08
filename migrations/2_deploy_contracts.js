const MSWallet = artifacts.require("./MSWallet.sol");

module.exports = function (deployer, network, accounts) {
    const owners = [accounts[0], accounts[1], accounts[2]]
    const numConfirmationsRequired = 2
    deployer.deploy(MSWallet, owners, numConfirmationsRequired);
};
