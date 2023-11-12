import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Collapse, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Subsamples } from '../../api/stuff/Subsample';

const AnalysisItems = ({ stuff, samples }) => {
  const [open, setOpen] = useState(false);
  const [showSubsamples, setShowSubsamples] = useState({});
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/detail/${stuff._id}`);
  };

  // Action for "Split" button
  const handleSplitClick = () => {
    navigate(`/split/${stuff._id}`);
  };

  const relevantSamples = samples.filter(sample => stuff.sampleIds.includes(sample._id));

  const { subsamples } = useTracker(() => {
    const subsamplesSubscription = Meteor.subscribe(Subsamples.analysis);

    const rdy = subsamplesSubscription.ready();

    const analysisItemsSubsamples = Subsamples.collection.find().fetch();

    return {
      subsamples: analysisItemsSubsamples,
      ready: rdy,
    };
  }, []);

  const protocolNames = {
    1: 'Measure and Dispose',
    2: 'Four Corners',
    3: 'One of All',
    4: 'Hybrid',
    5: 'Disentanglement',
    6: 'Reverse Engineer',
  };
  const protocolName = protocolNames[stuff.protocol];

  const toggleSubsamples = (sampleId) => {
    setShowSubsamples(prevState => ({
      ...prevState,
      [sampleId]: !prevState[sampleId],
    }));
  };

  const sampleCount = stuff && stuff.sampleIds ? stuff.sampleIds.length : 'error';
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{stuff.name}</Card.Title>
        <Row>
          <Col>This event has {sampleCount} sample{sampleCount > 1 ? 's' : ''} so far. Following the <b>{protocolName}</b> protocol.</Col>
        </Row>
        <Row>
          <Col className="text-right">
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              {open ? 'Close Samples' : 'Show Samples'}
            </Button>
          </Col>
        </Row>
        <Collapse in={open}>
          <div id="example-collapse-text">
            <Table>
              {/* Table code for samples comes here */}
              <thead>
                <tr>
                  <th>Sample ID</th>
                  <th>Name</th>
                  <th>_id</th>
                </tr>
              </thead>
              <tbody>
                {relevantSamples.map((sample) => {
                  const { sample_id: sampleId, name: sampleName, _id: sample_Id, subsampleIds = [] } = sample;
                  const isOpen = showSubsamples[sampleId] || false;

                  const relevantSubsamples = subsamples.filter(subsample => subsampleIds.includes(subsample._id));

                  return (
                    <React.Fragment key={sampleId}>
                      <tr>
                        <td>{sampleId}</td>
                        <td>{sampleName}</td>
                        <td>{sample_Id}</td>
                        <td>
                          <Button
                            onClick={() => toggleSubsamples(sampleId)}
                            aria-controls={`subsample-collapse-${sampleId}`}
                            aria-expanded={isOpen}
                          >
                            {isOpen ? 'Hide Subsamples' : `Show Subsamples (${subsamples.length})`}
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <Collapse in={isOpen}>
                            <div id={`subsample-collapse-${sampleId}`}>
                              <Table>
                                <thead>
                                  <tr>
                                    <th>Subsample ID</th>
                                    <th>_id</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {relevantSubsamples.map((subsample) => {
                                    const { subample_id: subsampleId, name: subsampleName, _id: subsample_Id = [] } = subsample;
                                    return (
                                      <tr key={subsample_Id}>
                                        <td>{subsampleId}</td>
                                        <td>{subsampleName}</td>
                                        <td>{subsample_Id}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>

                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default AnalysisItems;
