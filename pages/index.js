import React, { Component } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import Link from "next/link";

class Home extends Component {
  static async getInitialProps() {
    var campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const addresses = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group centered items={addresses} />;
  }

  render() {
    return (
      <div>
        <Layout>
          <h1>Open campaigns</h1>
          <Link href="/campaigns/new">
            <a>
              <Button content="+ Add Campaign " secondary floated="right" />
            </a>
          </Link>
          <div>{this.renderCampaigns()} </div>
        </Layout>
      </div>
    );
  }
}

export default Home;
