const { expect } = require("chai")
const chai = require("chai")
chai.use(require("chai-as-promised"))

const MSWallet = artifacts.require("MSWallet")
const BN = web3.utils.BN
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

contract("Multi Sig Wallet Contract", accounts => {
    const owners = [accounts[0], accounts[1], accounts[2]]
    const numConfirmationsRequired = 2

    let wallet
    beforeEach(async () => {
        wallet = await MSWallet.new(owners, numConfirmationsRequired)
    })

    describe("execute()", () => {
        beforeEach(async () => {
            await wallet.submit(owners[0], 0, "0x00")
            await wallet.confirm(0, { from: owners[0] })
            await wallet.confirm(0, { from: owners[1] })
        })

        it("should execute correctly", async () => {     
            const { logs } = await wallet.execute(0, { from: owners[0]})
            expect(logs[0].event).to.be.equal("Execute")
            expect(logs[0].args._owner).to.be.equal(owners[0])
            expect(logs[0].args._txIndex).to.be.a.bignumber.equal(new BN(0))
    
            expect((await wallet.getTransaction(0)).executed).to.be.true
        })
    
        it("should not execute if already executed", async () => {
            await wallet.execute(0, { from: owners[0]})
            await expect(wallet.execute(0, { from: owners[0]})).to.be.rejectedWith(/already executed/)
        })

        it("should not execute if tx does not exist", async () => {
            await expect(wallet.execute(5, { from: owners[0]})).to.be.rejectedWith(/does not exist/)
        })

        it("should not execute if caller is not the owner", async () => {
            await expect(wallet.execute(0, { from: accounts[5]})).to.be.rejectedWith(/not an owner/)
        })
    })

    describe("confirm()", () => {
        beforeEach(async () => {
            await wallet.submit(owners[0], 0, "0x00")
        })

        it("should confirm", async () => {
            await expect(wallet.confirm(0, { from: owners[0] })).to.be.fulfilled
        })

        it("should not confirm if transaction does not exist", async () => {
            await expect(wallet.confirm(5, { from: owners[0] })).to.be.rejectedWith(/does not exist/)
        })

        it("should not confirm if transaction is already executed", async () => {
            await wallet.confirm(0, { from: owners[0] })
            await wallet.confirm(0, { from: owners[1] })
            await wallet.execute(0, { from: owners[0]})

            await expect(wallet.confirm(0, { from: owners[0] })).to.be.rejectedWith(/already executed/)
        })

        it("should not confirm twice", async () => {
            await wallet.confirm(0, { from: owners[0] })
            await expect(wallet.confirm(0, { from: owners[0] })).to.be.rejectedWith(/already confirmed/)
        })
    })

    describe("revoke()", () => {
        beforeEach(async () => {
            await wallet.submit(owners[0], 0, "0x00")
            await wallet.confirm(0, { from: owners[0] })

        })

        it("should revoke", async () => {
            await expect(wallet.revoke(0, { from: owners[0] })).to.be.fulfilled
        })

        it("should not revoke if transaction does not exist", async () => {
            await expect(wallet.revoke(5, { from: owners[0] })).to.be.rejectedWith(/does not exist/)
        })

        it("should not confirm if transaction is already executed", async () => {
            await wallet.confirm(0, { from: owners[1] })
            await wallet.execute(0, { from: owners[0]})

            await expect(wallet.revoke(0, { from: owners[0] })).to.be.rejectedWith(/already executed/)
        })


    })

})