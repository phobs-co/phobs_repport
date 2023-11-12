import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
const OrgSignUp = ({ location }) => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    email: String,
    password: String,
    organizationToken: String, // Assuming you have a field for the organization token
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    const { email, password, organizationToken } = doc;

    // Validate organization token (you need to implement this part)
    if (!isValidOrganizationToken(organizationToken)) {
      setError('Invalid organization token.');
      return;
    }

    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
    });
  };

  const isValidOrganizationToken = (token) =>
    // Implement the logic to validate the organization token here
    // You might need to make a server call or use a library for token validation
    // Return true if the token is valid, otherwise return false
    // Example: return tokenValidationService.validateToken(token);
    true;
  const { from } = location?.state || { from: { pathname: '/add' } };
  if (redirectToReferer) {
    return <Navigate to={from} />;
  }

  return (
    <Container id="signup-page" className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Register your organization</h2>
          </Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <TextField name="email" placeholder="E-mail address" />
                <TextField name="password" placeholder="Password" type="password" />
                <TextField name="organizationToken" placeholder="Organization Token" />
                <ErrorsField />
                <SubmitField />
              </Card.Body>
            </Card>
          </AutoForm>
          {/* ... (existing code) */}
        </Col>
      </Row>
    </Container>
  );
};

OrgSignUp.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
  }),
};

OrgSignUp.defaultProps = {
  location: { state: '' },
};

export default OrgSignUp;
