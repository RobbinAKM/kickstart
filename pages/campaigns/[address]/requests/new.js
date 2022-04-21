import React, { Component } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

class NewRequest extends Component {
  state = {
    description: "",
    value: "",
    recipient: "",
    loading: false,
    errorMessage: "",
  };

  static async getInitialProps(props) {
    return {
      address: props.query.address,
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();

      const campaign = Campaign(this.props.address);
      await campaign.methods
        .createRequest(
          this.state.description,
          this.state.value,
          this.state.recipient
        )
        .send({ from: accounts[0] });
      window.location.replace(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  renderError = () => {
    return (
      <Message negative>
        <Message.Header>You have an error</Message.Header>
        <p>{this.state.errorMessage}</p>
        <Button onClick={this.resetError}>Clear</Button>
      </Message>
    );
  };

  resetError = () => {
    return this.setState({ errorMessage: "" });
  };

  render() {
    return (
      <Layout>
        <h1>Make a new request</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            fluid
            label="description"
            placeholder="description about your request"
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
          />
          <Form.Input
            fluid
            label="value"
            placeholder="amounted needed"
            value={this.state.value}
            onChange={(e) => this.setState({ value: e.target.value })}
          />
          <Form.Input
            fluid
            label="recipient"
            placeholder="recipient address"
            value={this.state.recipient}
            onChange={(e) => this.setState({ recipient: e.target.value })}
          />
          <Button loading={this.state.loading} type="submit">
            Submit
          </Button>
        </Form>
        {this.state.errorMessage ? this.renderError() : null}
      </Layout>
    );
  }
}

export default NewRequest;
