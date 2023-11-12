import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Modal } from 'react-bootstrap';
import { CheckSquareFill, PencilSquare } from 'react-bootstrap-icons';

const ReportedItem = ({ stuff }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleDetailsClick = () => {
    navigate(`/detail/${stuff._id}`);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClaim = () => {
    Meteor.call('stuffs.claim', stuff._id, Meteor.user().username, (error) => {
      if (error) {
        console.log(`Claiming ${stuff._id} failed`);
      } else {
        handleClose();
      }
    });
  };

  return (
    <>
      <tr>
        <td>{stuff.island}</td>
        <td>{stuff.city}</td>
        <td>{stuff.type}</td>
        <td>{stuff.located}</td>
        <td>{stuff.describe}</td>
        <td><Button variant="secondary" onClick={handleDetailsClick}><PencilSquare /></Button></td>
        <td><Button onClick={handleShow}><CheckSquareFill /></Button></td>
      </tr>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Claim Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to claim this debris for your organization?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClaim}>
            Claim
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default ReportedItem;
