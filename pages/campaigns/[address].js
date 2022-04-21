import React, { Component } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import Contribute from "../../components/Contribute";
import Link from "next/link";

class ShowCampaign extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      length: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderItems = () => {
    const items = [
      {
        header: this.props.manager,
        description: "The address of the account who created this campaign",
        meta: "Address of the manager",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(this.props.minimumContribution, "ether"),
        description: "The minimum amount in ether to use for this campaign",
        meta: "minimum contribution in ether",
      },
      {
        header: web3.utils.fromWei(this.props.balance, "ether"),
        description: "Total number of contributions for this campaign",
        meta: "Campaign balance in ether",
      },
      {
        header: this.props.approversCount,
        description: "Total number of contributors for this campaign",
        meta: "Number of contributers",
      },
      {
        header: this.props.length,
        description: "Total number of requests for this campaign",
        meta: "Number of requests",
      },
    ];
    return (
      <>
        <Card.Group items={items} />
        {this.props.length ? (
          <Link href={`/campaigns/${this.props.address}/requests`}>
            <Button secondary>view requests</Button>
          </Link>
        ) : null}
      </>
    );
  };
  render() {
    return (
      <>
        <Layout>
          <Grid>
            <Grid.Column width={10}>{this.renderItems()}</Grid.Column>
            <Grid.Column width={6}>
              <Contribute address={this.props.address} />
            </Grid.Column>
          </Grid>
        </Layout>
      </>
    );
  }
}

export default ShowCampaign;
