import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

/* eslint-disable no-console */

const createUser = (email, password, role, organization, organizationToken) => {
  console.log(`  Creating user ${email || organization}.`);

  const userOptions = {
    email: email,
    password: password,
    username: email || organization, // Use email as username or fallback to organization
    organization: organization,
    organizationToken: organizationToken,
  };

  // Check if username and password are not provided, then use organization and organizationToken
  if (!email && !password) {
    userOptions.password = organizationToken;
  }

  const userID = Accounts.createUser(userOptions);

  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
};

// When running app for first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.forEach(({ email, password, role, organization, organizationToken }) =>
        createUser(email, password, role, organization, organizationToken)
    );
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
