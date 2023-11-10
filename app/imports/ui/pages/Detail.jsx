import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row, Image, Modal, Button } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useField } from 'uniforms';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';

const bridge = new SimpleSchema2Bridge(Stuffs.schema);

const DistributionField = ({ distributionValue, ...props }) => {
  const fieldProps = useField(props.name, props)[0]; // Add this line

  const distributionTypes = {
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };

  const options = Object.keys(distributionTypes).map(key => ({
    label: distributionTypes[key],
    value: parseInt(key, 10),
  }));

  return (distributionValue !== null && distributionValue !== undefined) || fieldProps.value
    ? <SelectField {...props} options={options} onChange={v => fieldProps.onChange(v)} value={fieldProps.value} />
    : <TextField {...props} value="The event has not been distributed." disabled />;
};

const ProtocolField = ({ protocolValue, ...props }) => {
  const fieldProps = useField(props.name, props)[0]; // This value gets updated when field changes.

  console.log('Protocol Value: ', protocolValue);

  const protocolNames = {
    1: 'Measure and Dispose',
    2: 'Four Corners',
    3: 'One of All',
    4: 'Hybrid',
    5: 'Disentanglement',
    6: 'Reverse Engineer',
  };

  const options = Object.keys(protocolNames).map(key => ({
    label: protocolNames[key],
    value: parseInt(key, 10),
  }));

  return (protocolValue !== null && protocolValue !== undefined) || fieldProps.value
    ? <SelectField {...props} options={options} onChange={v => fieldProps.onChange(v)} value={fieldProps.value} />
    : <TextField {...props} value="The event does not have samples yet." disabled />;
};

const WeightField = (props) => {
  const [show, setShow] = React.useState(false);
  const [weight, setWeight] = React.useState(0);
  const [unit, setUnit] = React.useState('kg'); // default unit

  const field = useField(props.name, props, { initialValue: false })[0];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const saveWeight = () => {
    const convertedWeight = unit === 'lbs' ? parseFloat(weight) * 0.45359237 : parseFloat(weight);
    field.onChange(convertedWeight);
    handleClose();
  };

  return (
    <>
      { field.value !== undefined && !Number.isNaN(parseFloat(field.value))
        ? <TextField {...props} value={`${field.value.toFixed(2)} kg`} disabled />
        : <TextField {...props} value="This event does not yet have a recorded weight." disabled /> }
      <Button variant={field.value !== undefined && !Number.isNaN(parseFloat(field.value)) ? 'outline-secondary' : 'primary'} onClick={handleShow}>
        { field.value !== undefined && !Number.isNaN(parseFloat(field.value)) ? 'Adjust Weight' : 'Add Weight' }
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Weight</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="number" step="0.01" min="0.01" value={weight} onChange={handleWeightChange} />
          <select value={unit} onChange={handleUnitChange}>
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveWeight}>
            Save Weight
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const Detail = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  // useParams was not working so switched to window.location.href
  const url = window.location.href;
  const parts = url.split('/');
  const _id = parts[parts.length - 1];
  const { doc, ready } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.adminPublicationName);
    const rdy = subscription.ready();
    const document = Stuffs.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);

  const protocolValue = doc && doc.protocol;

  const submit = (data) => {
    const { name, status, type, located, describe, island, protocol, facility, distribution, wetWeight, dryWeight } = data;
    Stuffs.collection.update(_id, { $set: { name, status, type, located, describe, island, protocol, facility, distribution, wetWeight, dryWeight } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Event updated successfully', 'success')));
  };

  console.log(Stuffs.collection.findOne(_id));
  return ready ? (

    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Col className="text-center"><h2>Debris Event Details</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Card>
              <Card.Body>
                <TextField name="owner" disabled />
                <SelectField name="status" />
                <SelectField name="type" />
                <SelectField name="located" />
                <SelectField name="describe" />
                <SelectField name="island" />
                <ProtocolField name="protocol" protocolValue={protocolValue} />
                <TextField name="facility" />
                <DistributionField name="distribution" distributionValue={doc && doc.distribution} />

                <TextField name="claimedAt" disabled />
                <TextField name="eventId" disabled />
                <WeightField name="wetWeight" label="Wet Weight" />
                <WeightField name="dryWeight" label="Dry Weight" />
                <TextField name="sampleIds" disabled />
                {
                  doc && doc.image
                    ? <Image src={doc.image} alt="Loaded from AWS" rounded fluid />
                    : <p>No image submitted for this event.</p>
                }
                <SubmitField value="Save Changes" />
                <ErrorsField />
                <HiddenField name="owner" />

              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Detail;
