import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

const ShowConfirm = (props) => {
  const [open, setOpen] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const campaign = Campaign(props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(props.index)
        .send({ from: accounts[0] });
      location.reload();
    } catch (err) {
      setErr(err.message);
    }
    setLoading(false);
    setOpen(false);
  };
  err ? alert(err) : null;

  setTimeout(function () {
    setErr("");
  }, 2000);

  return (
    <Modal
      closeIcon
      open={open}
      trigger={props.children}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header icon="archive" content="Archive Old Messages" />
      <Modal.Content>
        <p>Do you really want to finalize your {props.index}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
          color="green"
          onClick={() => handleFinalize()}
          loading={loading}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ShowConfirm;
