import React from "react";
import { Button, Header, Icon, Modal, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const ShowModal = (props) => {
  const [open, setOpen] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleProve = async () => {
    setLoading(true);
    try {
      const campaign = Campaign(props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(props.index)
        .send({ from: accounts[0] });
      location.reload();
    } catch (err) {
      setErr(err.message);
    }
    setLoading(false);
    setOpen(false);
  };

  props.func(err);
  setTimeout(function () {
    setErr("");
  }, 2000);

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={props.children}
    >
      <Header icon>
        <Icon name="check circle" />
        Would you like to approve this request ?
      </Header>
      <Modal.Content>
        <p>
          {props.request}
          {props.index}
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => handleProve()}
          loading={loading}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ShowModal;
