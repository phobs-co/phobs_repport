import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
<<<<<<< HEAD
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';
import DisposedItem from '../components/DisposedItem';
=======
import { useNavigate } from 'react-router-dom';
import { Debris } from '../../api/debris/Debris';
import LoadingSpinner from '../components/LoadingSpinner';

const DisposedItems = ({ debris }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${debris._id}`);
  };

  return (
    <tr>
      <td>{debris.result}</td>
      <td>{debris.type}</td>
      <td><Button onClick={handleDetailsClick}>Details</Button></td>
    </tr>
  );
};
>>>>>>> sam

const ListDisposed = () => {
  const { ready, debris } = useTracker(() => {
    const subscription = Meteor.subscribe(Debris.disposed);
    const rdy = subscription.ready();
    const disposedItems = Debris.collection.find().fetch();

    return {
      debris: disposedItems,
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
<<<<<<< HEAD
              {stuffs.map((stuff) => <DisposedItem key={stuff._id} stuff={stuff} />)}
=======
              {debris.map((debris) => <DisposedItems key={debris._id} debris={debris} />)}
>>>>>>> sam
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListDisposed;
