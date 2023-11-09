import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button, Modal } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { XSquareFill, CheckSquareFill, PencilSquare } from 'react-bootstrap-icons';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';

const ClaimedItems = ({ stuff }) => {
  const navigate = useNavigate();
  const [showRelease, setShowRelease] = useState(false);
  const [showStore, setShowStore] = useState(false);

  const claimTime = stuff.claimedAt;
  const [timer, setTimer] = useState(claimTime ? Date.now() - claimTime : null);
  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/detail/${stuff._id}`);
  };

  // Action for "Release" button
  const handleCloseRelease = () => setShowRelease(false);
  const handleShowRelease = () => setShowRelease(true);

  const handleCloseStore = () => setShowStore(false);
  const handleShowStore = () => setShowStore(true);

  const handleRelease = () => {
    Meteor.call('stuffs.release', stuff._id, (error) => {
      if (error) {
        console.log(`Releasing ${stuff._id} failed`);
      } else {
        handleCloseRelease();
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (claimTime) {
        const currentTime = Date.now();
        const timeElapsed = Math.floor((currentTime - claimTime) / 1000);
        setTimer(120 * 60 * 60 - timeElapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [claimTime]);

  useEffect(() => {
    // If timer reaches 0, this releases the debris. However, this is not the best way to do this.
    // The timer should be set on the server side, and the server should release the debris when the timer reaches 0. For now this is a temporary solution.
    if (timer === 0) handleRelease();
  }, [timer]);

  const seconds = Math.floor((timer) % 60).toString().padStart(2, '0');
  const minutes = Math.floor((timer / 60) % 60).toString().padStart(2, '0');
  const hours = Math.floor((timer / 3600) % 24).toString().padStart(2, '0');
  const days = Math.floor(timer / (3600 * 24)).toString();

  const handleStore = () => {
    Meteor.call('stuffs.store', stuff._id, (error) => {
      if (error) {
        console.log(`Moving ${stuff._id} to storage failed`);
      } else {
        handleCloseStore();
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
        <td><Button onClick={handleDetailsClick}><PencilSquare /></Button></td>
        <td><Button variant="outline-danger" onClick={handleShowRelease} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><XSquareFill /> {` ${days}:${hours}:${minutes}:${seconds}`}</Button></td>
        <td><Button onClick={handleShowStore}><CheckSquareFill /></Button></td>
      </tr>

      <Modal show={showRelease} onHide={handleCloseRelease}>
        <Modal.Header closeButton>
          <Modal.Title>Unclaim Debris</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this debris from your claimed list?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRelease}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRelease}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showStore} onHide={handleCloseStore}>
        <Modal.Header closeButton>
          <Modal.Title>Move Debris to Storage</Modal.Title>
        </Modal.Header>
        <Modal.Body>Has this debris been collected and moved to storage?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStore}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStore}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

/* Renders a table containing all of the Stuff documents. Use <ClaimedItems> to render each row. */
const ListClaimed = () => {
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.claimed);
    const rdy = subscription.ready();
    const claimedItems = Stuffs.collection.find().fetch();
    return {
      stuffs: claimedItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Claimed Debris</h2>
            <p>This debris has been claimed your organization but you have not yet reported it as collected</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Island</th>
                <th>City</th>
                <th>Type</th>
                <th>Located</th>
                <th>Details</th>
                <th>Remove</th>
                <th>Store</th>
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff) => <ClaimedItems key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListClaimed;
