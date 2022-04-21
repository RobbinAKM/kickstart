const mocha = require("mocha");
const ganache = require("ganache-cli");
const assert = require("assert");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAdress;
let campaign;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({
      data: compiledFactory.bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAdress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAdress
  );
});

describe("both factory and campaign exists", () => {
  it("factory exists", () => {
    assert.ok(factory.options.address);
  });
  it("campaign exists", () => {
    assert.ok(campaign.options.address);
  });
});

it("caller is the manager", async () => {
  const manager = await campaign.methods.manager().call();
  assert.equal(accounts[0], manager);
});

it("contribute money and marks as approvers", async () => {
  await campaign.methods.contribute().send({ from: accounts[1], value: "110" });
  const contributer = campaign.methods.approvers(accounts[1]).call();

  assert(contributer);
});

it("has minimum contribution", async () => {
  const minimum = await campaign.methods.minimumContribution().call();
  assert.ok(minimum);
});

it("manager can make the request", async () => {
  await campaign.methods
    .createRequest("string description", "100", accounts[1])
    .send({ from: accounts[0], gas: "1000000" });
  const request = await campaign.methods.requests(0).call();
  assert.ok(request);
});
