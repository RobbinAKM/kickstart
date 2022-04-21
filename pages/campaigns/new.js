import React, { Component } from "react";
import Layout from "../../components/Layout";
import "semantic-ui-css/semantic.min.css";
import { Button, Form, Segment, Input, Message } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";

class NewCampaign extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });
    } catch (e) {
      this.setState({ errorMessage: e.message });
    }
    this.setState({ loading: false });
  };

  renderError = () => {
    if (this.state.minimumContribution) {
      return (
        <Message negative>
          <Message.Header>You have an error</Message.Header>
          <p>{this.state.errorMessage}</p>
          <Button onClick={this.resetError}>Clear</Button>
        </Message>
      );
    }
  };

  resetError = () => {
    return this.setState({ errorMessage: "" });
  };

  render() {
    return (
      <Layout>
        <h1>New campaign</h1>
        <Segment inverted>
          <Form inverted onSubmit={this.handleSubmit}>
            <Form.Group widths="equal">
              <Input
                label={{ basic: true, content: "wei" }}
                labelPosition="right"
                placeholder="Enter your minimum amount"
                value={this.state.minimumContribution}
                onChange={(e) =>
                  this.setState({ minimumContribution: e.target.value })
                }
              />
            </Form.Group>
            {this.state.errorMessage ? this.renderError() : null}
            <Button loading={this.state.loading} type="submit">
              Submit
            </Button>
          </Form>
        </Segment>
      </Layout>
    );
  }
}

export default NewCampaign;
