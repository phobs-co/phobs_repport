import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill, ChatQuote } from 'react-bootstrap-icons';

const NavBar = () => {
  const [isGuest, setIsGuest] = useState(false);

  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  const handleGuestLogin = () => {
    // Replace the following logic with the code to set the user to the guest account
    Meteor.loginWithPassword('guest@foo.com', 'changeme', (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Guest login error:', error);
      } else {
        setIsGuest(true);
      }
    });
  };

  const handleGuestLogout = () => {
    // Replace the following logic with the code to set the user to the guest account
    setIsGuest(false);
  };

  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <h4>Repport <ChatQuote /></h4>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {isGuest || currentUser ? ([
              <Nav.Link id="add-stuff-nav" as={NavLink} to="/add" key="add">Add Stuff</Nav.Link>,
              <Nav.Link id="add-stuff-nav" as={NavLink} to="/report" key="report">Report Debris</Nav.Link>,
              <Nav.Link id="list-stuff-nav" as={NavLink} to="/list" key="list">Everything</Nav.Link>,
              <Nav.Link id="list-stuff-nav" as={NavLink} to="/reported" key="reported">Reported</Nav.Link>,
              <Nav.Link id="list-stuff-nav" as={NavLink} to="/claimed" key="claimed">Claimed</Nav.Link>,
              <Nav.Link id="list-stuff-nav" as={NavLink} to="/stored" key="stored">Stored</Nav.Link>,
              <Nav.Link id="list-stuff-nav" as={NavLink} to="/distributed" key="disposed">Distributed</Nav.Link>,
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
              <>
                <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/analysis" key="analysis">Analysis</Nav.Link>
                <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/admin" key="admin">Admin</Nav.Link>
              </>
            ) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin">
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup">
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-guest" as={NavLink} to="/#" onClick={handleGuestLogin}>
                  <PersonFill />
                  Guest
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="navbar-current-user" title={currentUser}>
                <NavDropdown.Item id="navbar-sign-out" as={NavLink} to="/signout" onClick={handleGuestLogout}>
                  <BoxArrowRight />
                  {' '}
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
