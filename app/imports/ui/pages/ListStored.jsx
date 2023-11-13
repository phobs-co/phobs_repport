import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';
import StoredItem from '../components/StoredItem';

const ListStored = () => {
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.stored);
    const rdy = subscription.ready();
    const storedItems = Stuffs.collection.find().fetch();

    return {
      stuffs: storedItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>DFG Events in Storage</h2>
            <p>This debris has been collected and is being stored by your organization</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Facility</th>
                <th>Type</th>
                <th>Details</th>
                <th>Transfer</th>
                <th>Sample</th>
                <th>Distributed</th>
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff) => <StoredItem key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListStored;
