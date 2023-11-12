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
    organization: String,
    organizationToken: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    const { organization, organizationToken } = doc;

    // Validate organization token (you need to implement this part)
    if (!isValidOrganizationToken(organizationToken)) {
      setError('Invalid organization token.');
      return;
    }

    // Use the organization name as the username and organization token as the password
    Accounts.createOrganization({ username: organization, password: organizationToken }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
    });
  };

  const isValidOrganizationToken = (token) => {
    // Implement the logic to validate the organization token here
    // You might need to make a server call or use a library for token validation
    // Return true if the token is valid, otherwise return false
    // Example: return tokenValidationService.validateToken(token);
    return true;
  };

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
                  <TextField name="organization" placeholder="Organization name" />
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
