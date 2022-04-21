import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x7A5c08e704f24fdF2541EC2e8919eBB7dF537727"
);

export default instance;
