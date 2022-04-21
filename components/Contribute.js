import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import { Input, Button, Form, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class Contribute extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
  };

  renderError = () => {
    if (this.state.value && this.state.errorMessage) {
      return (
        <Message negative>
          <Message.Header>You have an error</Message.Header>
          <p>{this.state.errorMessage}</p>
          <Button onClick={this.resetError}>Clear</Button>
        </Message>
      );
    }
    this.resetError();
  };

  resetError = () => {
    return this.setState({ errorMessage: "" });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      location.reload();
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };
  render() {
    return (
      <>
        <h2>Contribute to the campaign</h2>
        <Form onSubmit={this.handleSubmit}>
          <Input
            placeholder="amount"
            label="ether"
            value={this.state.value}
            onChange={(e) => this.setState({ value: e.target.value })}
          />
          <Button
            loading={this.state.loading}
            secondary
            type="submit"
            style={{ display: "flex", marginTop: "10px" }}
          >
            Contribute
          </Button>
        </Form>
        {this.state.errorMessage ? this.renderError() : null}
      </>
    );
  }
}

export default Contribute;
