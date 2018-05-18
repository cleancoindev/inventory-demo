const assertRejected = require("assert-rejected");
// const testHelper = require("truffle-test-helpers");
// const utils = require("web3-utils");

const UserRegistry = artifacts.require("contracts/UserRegistry.sol");

contract("UserRegistry", accounts => {
  const accountA = accounts[1];
  const accountB = accounts[2];
  const accountC = accounts[3];
  const accountAOptions = {from: accountA};
  const accountBOptions = {from: accountB};
  const accountCOptions = {from: accountC};

  let userRegistry;

  beforeEach(async () => {
    userRegistry = await UserRegistry.new();
  });

  it("should be created correctly", async () => {
  });

  it("has no users", async () => {
    assert.equal(await userRegistry.numUsers(), 0);
  });

  describe("when one user is added", () => {
    beforeEach(async () => {
      await userRegistry.add(accountAOptions);
    });

    it("has one user", async () => {
      assert.equal(await userRegistry.numUsers(), 1);
      assert.isTrue(await userRegistry.isUser(accountA));
    });

    it("lets the user remove themselves", async () => {
      await userRegistry.remove(accountAOptions);
      assert.equal(await userRegistry.numUsers(), 0);
      assert.isFalse(await userRegistry.isUser(accountA));
    });

    it("won't let anyone else remove themselves", async () => {
      await assertRejected(userRegistry.remove(accountBOptions));
    });

    describe("and a few more users", () => {
      beforeEach(async () => {
        await userRegistry.add(accountBOptions);
        await userRegistry.add(accountCOptions);
      });

      it("has three user", async () => {
        assert.equal(await userRegistry.numUsers(), 3);
      });

      it("lets user A remove themselves", async () => {
        await userRegistry.remove(accountAOptions);
        assert.equal(await userRegistry.numUsers(), 2);
      });
    });
  });
});
