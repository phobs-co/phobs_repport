import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';
import ReportedItem from '../components/ReportItem';

const ListReported = () => {
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.unclaimed);
    const rdy = subscription.ready();
    const reportedItems = Stuffs.collection.find().fetch();

    return {
      stuffs: reportedItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Reported & Unclaimed Debris</h2>
            <p>This debris has been reported by individuals from the public and organizations within this program.</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Island</th>
                <th>City</th>
                <th>Type</th>
                <th>Located</th>
                <th>Describe</th>
                <th>Details</th>
                <th>Claim</th>
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff) => <ReportedItem key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListReported;
