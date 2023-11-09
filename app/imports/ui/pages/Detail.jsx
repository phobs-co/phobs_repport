import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row, Image } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';

const bridge = new SimpleSchema2Bridge(Stuffs.schema);

const DistributionField = ({ onChange, value, ...props }) => {
  const distributionTypes = {
    0: 'Not reported',
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };

  const options = Object.keys(distributionTypes).map(key => ({
    label: distributionTypes[key],
    value: parseInt(key, 10),
  }));

  return value !== undefined
    ? <SelectField {...props} options={options} onChange={v => onChange(parseInt(v, 10))} value={value} />
    : <TextField {...props} value="The event has not been distributed." disabled />;
};

const ProtocolField = ({ onChange, value, ...props }) => {
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

  return value !== undefined
    ? <SelectField {...props} options={options} onChange={v => onChange(parseInt(v, 10))} value={value} />
    : <TextField {...props} value="The event does not have samples yet." disabled />;
};
const DetailsStuff = () => {
  let { _id } = useParams();
  console.log('param:', useParams()._id);
  _id = 'PEYXRAyaofC4Y6kT5';
  const { doc, ready } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.adminPublicationName);
    const rdy = subscription.ready();
    const document = Stuffs.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);

  const submit = (data) => {
    console.log('submit function data:', data);
    const { name, status, type, located, describe, island, protocol, facility, distribution } = data;
    Stuffs.collection.update(_id, { $set: { name, status, type, located, describe, island, protocol, facility, distribution } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Event updated successfully', 'success')));
  };

  console.log(doc);
  console.log('Is subscription ready?', ready);
  console.log(doc);
  console.log('id: ', _id);
  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Col className="text-center"><h2>Item Details</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Card>
              <Card.Body>
                <TextField name="owner" disabled />
                <SelectField name="status" />
                <SelectField name="type" />
                <SelectField name="located" />
                <SelectField name="describe" />
                <SelectField name="island" />
                <ProtocolField name="protocol" />
                <TextField name="facility" />
                <DistributionField name="distribution" />

                <TextField name="claimedAt" disabled />
                <TextField name="eventId" disabled />
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

export default DetailsStuff;
