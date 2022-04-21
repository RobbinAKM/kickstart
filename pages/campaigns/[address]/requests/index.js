import React, { Component } from "react";
import Campaign from "../../../../ethereum/campaign";
import { Icon, Table, Header, Item, Button, Message } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../../../../components/Layout";
import ShowModal from "../../../../components/Modal";
import ShowConfirm from "../../../../components/Confirm";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";

class Request extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    let requests = [];
    const requestCounts = await campaign.methods.getRequestCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const manager = await campaign.methods.manager().call();

    for (var i = 0; i < requestCounts; i++) {
      const item = await campaign.methods.requests(i).call();
      requests.push(item);
    }
    return {
      address: props.query.address,
      requestCounts,
      requests,
      approversCount,
      manager,
    };
  }

  show_err = (data) => {
    if (data) alert(data);
  };

  render() {
    //console.log(this.props.requests);
    return (
      <Layout>
        <Header as="h3" block style={{ overflowWrap: "break-word" }}>
          Request page for {this.props.address}
        </Header>
        <Link href={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button content="+ make a new request" secondary floated="right" />
          </a>
        </Link>
        <Item.Group relaxed>
          <Item>
            <Item.Content verticalAlign="middle">
              <Icon name="thumbtack" />
              <Item.Header as="a">
                Number of requests : {this.props.requestCounts}
              </Item.Header>
            </Item.Content>
            <Item.Content verticalAlign="middle">
              Click on each description to approve
            </Item.Content>
          </Item>
        </Item.Group>

        <Table celled>
          <Table.Header style={{ backgroundColor: "grey" }}>
            <Table.Row>
              <Table.HeaderCell>description</Table.HeaderCell>
              <Table.HeaderCell>value</Table.HeaderCell>
              <Table.HeaderCell>recipient address</Table.HeaderCell>
              <Table.HeaderCell>approval counts</Table.HeaderCell>
              <Table.HeaderCell>completed</Table.HeaderCell>
              <Table.HeaderCell>finish your request</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {this.props.requests.map((request, index) => (
            <Table.Body key={index}>
              <Table.Row>
                <ShowModal
                  func={this.show_err}
                  request={request[0]}
                  index={index}
                  address={this.props.address}
                >
                  <Table.Cell>
                    <a>{request[0]} </a>
                  </Table.Cell>
                </ShowModal>

                <Table.Cell>
                  {web3.utils.fromWei(request[1], "ether")} ether
                </Table.Cell>
                <Table.Cell>{request[2]}</Table.Cell>
                <Table.Cell>
                  {request[4]} / {this.props.approversCount}
                </Table.Cell>
                {!request[3] ? (
                  <Table.Cell negative>
                    <Icon name="close" />
                  </Table.Cell>
                ) : (
                  <Table.Cell positive>
                    <Icon name="checkmark" />
                  </Table.Cell>
                )}

                <Table.Cell>
                  {!request[3] ? (
                    <ShowConfirm
                      manager={this.props.manager}
                      index={index}
                      address={this.props.address}
                    >
                      <Button>Finalize</Button>
                    </ShowConfirm>
                  ) : null}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </Layout>
    );
  }
}

export default Request;
