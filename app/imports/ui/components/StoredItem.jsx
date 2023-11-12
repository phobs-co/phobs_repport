import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ArrowLeftRight, CheckSquareFill, PencilSquare, PeopleFill } from 'react-bootstrap-icons';
import { Samples } from '../../api/stuff/Sample';
import { Stuffs } from '../../api/stuff/Stuff';

const StoredItem = ({ stuff }) => {
  const navigate = useNavigate();
  const [showDispose, setShowDispose] = useState(false);
  const [showNewSample, setShowNewSample] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(0);
  const [selectedDistribution, setSelectedDistribution] = useState(0);

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/detail/${stuff._id}`);
  };

  // Action for "Transfer" button
  const handleTransferClick = () => {
    navigate(`/transfer/${stuff._id}`);
  };

  // Actions for "Sample" button

  const handleExistingSampleClick = () => {
    navigate(`/analysis#${stuff.event_id}`);
  };

  // if none exists: ask what sample protocol they are using 1-6 via dropdown
  // generally: open form with corresponding questions
  const handleCloseNewSample = () => setShowNewSample(false);
  const handleShowNewSample = () => setShowNewSample(true);
  const handleNewSample = () => {
    // create new sample
    console.log(selectedProtocol);
    const newSampleId = Samples.collection.insert({
      name: 'Sample Initial',
      event_id: 'a', // stuff.eventId
      sample_id: '0001',
    }, (err, _id) => { // callback function to get the _id of the inserted document
      if (err) {
        console.error('Could not insert new sample:', err);
      } else {
        Meteor.call('stuffs.linkSamplesWithEvent', stuff._id, [newSampleId], selectedProtocol, (error) => {
          if (error) {
            console.log(`Creating a sample for ${stuff._id} failed${error}`);
          } else {
            handleCloseNewSample();
          }
        });
      }
    });
  };

  const handleProtocolChange = (e) => {
    setSelectedProtocol(+e.target.value);
  };

  const handleDistributionChange = (e) => {
    setSelectedDistribution(+e.target.value);
  };

  const handleCloseDispose = () => setShowDispose(false);
  const handleShowDispose = () => setShowDispose(true);

  const handleDispose = () => {
    Meteor.call('stuffs.dispose', stuff._id, selectedDistribution, (error) => {
      if (error) {
        console.log(`Marking ${stuff._id} as disposed failed`);
      } else {
        handleCloseDispose();
      }
    });
  };

  const eventItem = Stuffs.collection.findOne(stuff._id);

  const SampleButton = (eventItem && (!eventItem.sampleIds || eventItem.sampleIds.length === 0)) ?
    <Button onClick={handleShowNewSample} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Create</Button> :
    <Button onClick={handleExistingSampleClick} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Open</Button>;

  return (
    <>
      <tr>
        <td>{stuff.facility}</td>
        <td>{stuff.type}</td>
        <td><Button variant="secondary" onClick={handleDetailsClick}><PencilSquare /></Button></td>
        <td><Button variant="secondary" onClick={handleTransferClick}><ArrowLeftRight /> <PeopleFill /></Button></td>
        <td>{SampleButton}</td>
        <td><Button variant="success" onClick={handleShowDispose}><CheckSquareFill /></Button></td>
      </tr>

      <Modal show={showDispose} onHide={handleCloseDispose}>
        <Modal.Header closeButton>
          <Modal.Title>Distributed Debris</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to mark this debris as distributed?</p>
          <Form>
            <Form.Group controlId="distribution-select">
              <Form.Label>Select the distribution type you used:</Form.Label>
              <Form.Control as="select" value={selectedDistribution} onChange={handleDistributionChange}>
                <option value="">...</option>
                <option value="1">Recycled</option>
                <option value="2">Reused</option>
                <option value="3">Other 🫣</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDispose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleDispose}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNewSample} onHide={handleCloseNewSample}>
        <Modal.Header closeButton>
          <Modal.Title>Sample Debris</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to log samples for this event?
          <br />
          <Form>
            <Form.Group controlId="protocol-select">
              <Form.Label>Select the Protocol you are using:</Form.Label>
              <Form.Control as="select" value={selectedProtocol} onChange={handleProtocolChange}>
                <option value="">...</option>
                <option value="1">Measure and Dispose</option>
                <option value="2">Four Corners</option>
                <option value="3">One of All</option>
                <option value="4">Hybrid</option>
                <option value="5">Disentanglement</option>
                <option value="6">Reverse Engineer</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewSample}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleNewSample}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default StoredItem;
