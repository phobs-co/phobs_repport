import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { PencilSquare } from 'react-bootstrap-icons';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';

const DisposedItems = ({ stuff }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/detail/${stuff._id}`);
  };

  const distributionTypes = {
    0: 'Not reported',
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };
  const distributionType = distributionTypes[stuff.distribution];

  return (
    <tr>
      <td>{distributionType}</td>
      <td>{stuff.type}</td>
      <td><Button variant="secondary" onClick={handleDetailsClick}><PencilSquare /></Button></td>
    </tr>
  );
};

const ListDisposed = () => {
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.disposed);
    const rdy = subscription.ready();
    const disposedItems = Stuffs.collection.find().fetch();

    return {
      stuffs: disposedItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>DFG Events that have been Distributed</h2>
            <p>This debris has been recycled, reused, etc. Samples may have been collected and these can still be viewed anytime.</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Result</th>
                <th>Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff) => <DisposedItems key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListDisposed;
