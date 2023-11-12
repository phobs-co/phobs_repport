import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';
import { Samples } from '../../api/stuff/Sample';
import AnalysisPieChart from '../components/AnalysisPieChart';
import AnalysisItems from '../components/AnalysisItem';

const ListAnalysis = () => {
  const { _id } = useParams();
  const { ready, stuffs, samples } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.analysis);
    const subscriptionSamples = Meteor.subscribe(Samples.analysis);

    const rdy = subscription.ready() && subscriptionSamples.ready();

    const analysisItemsStuffs = Stuffs.collection.find().fetch();
    const analysisItemsSamples = Samples.collection.find().fetch();
    const doc = Stuffs.collection.findOne(_id);

    return {
      stuffs: analysisItemsStuffs,
      samples: analysisItemsSamples,
      ready: rdy,
      document: doc,
    };
  }, [_id]);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={9}>
          <Col className="text-center">
            <h2>Lab: Collected Samples</h2>
            <p>Any sample that you have logged will be displayed here. You can view them in more detail, record properties, and log subsamples and components.</p>
          </Col>
          <Container>
            <h3>DFG Events with Recorded Samples</h3>

            {stuffs.map((stuff) => <AnalysisItems key={stuff._id} stuff={stuff} samples={samples} />)}

          </Container>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={9}>
          <AnalysisPieChart />
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListAnalysis;
