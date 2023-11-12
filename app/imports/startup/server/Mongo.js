import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Samples } from '../../api/stuff/Sample.js';
import { Subsamples } from '../../api/stuff/Subsample.js';
import { Components } from '../../api/stuff/Component.js';

/* eslint-disable no-console */

// Initialize the database with a default data document.
const addData = (data) => {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.collection.insert(data);
};

// Initialize the StuffsCollection if empty.
if (Stuffs.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}

Meteor.methods({
  'stuffs.claim'(itemId, newOwner) {
    check(itemId, String);
    check(newOwner, String);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Stuffs.collection.update(itemId, { $set: { status: 'claimed' } });
    Stuffs.collection.update(itemId, { $set: { owner: newOwner } });
    Stuffs.collection.update(itemId, { $set: { claimedAt: Date.now() } });
  },
});

Meteor.methods({
  'stuffs.release'(itemId) {
    check(itemId, String);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Stuffs.collection.update(itemId, { $set: { status: 'unclaimed' } });
    // currently does not change owner back
  },
});

Meteor.methods({
  'stuffs.store'(itemId) {
    check(itemId, String);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Stuffs.collection.update(itemId, { $set: { status: 'stored' } });
  },
});

// newOwner could be provided through a selection menu
Meteor.methods({
  'stuffs.transfer'(itemId, newOwner) {
    check(itemId, String);
    check(newOwner, String);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Stuffs.collection.update(itemId, { $set: { owner: newOwner } });
  },
});

Meteor.methods({
  'stuffs.dispose'(itemId, selectedDistribution) {
    check(itemId, String);
    check(selectedDistribution, Number);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Stuffs.collection.update(itemId, { $set: { status: 'disposed' } });
    Stuffs.collection.update(itemId, { $set: { distribution: selectedDistribution } });
  },
});

// TODO: Make this
// Meteor.methods({
//   'stuffs.split'(itemId, quantity) {
//     // TODO: Add validation and permission checks (they might be allowed to move it)
//     Stuffs.collection.add([NEW DOCUMENTS WITH SAME BASE ID]);
//   },
// });

// -----------------------------------------------------------------------------------
//  --------------------------        SAMPLES       ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  'stuffs.linkSamplesWithEvent'(eventId, sampleIds, protocol = null) {
    check(eventId, String);
    check(sampleIds, [String]);
    protocol && check(protocol, Number);

    const existingEvent = Stuffs.collection.findOne(eventId);
    if (!existingEvent) {
      throw new Meteor.Error('404', 'Event not found: linkSamplesWithEvent');
    }

    Stuffs.collection.update(eventId, { $addToSet: { sampleIds: { $each: sampleIds } } });
    Stuffs.collection.update(eventId, { $set: { hasSamples: true } });
    protocol && Stuffs.collection.update(eventId, { $set: { protocol: protocol } });
  },
});

// -----------------------------------------------------------------------------------
//  --------------------------       SUBSAMPLES      ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  'samples.linkSubamplesWithSamples'(sampleId, subsampleIds) {
    check(sampleId, String);
    check(subsampleIds, [String]);

    Stuffs.collection.update(sampleId, { $addToSet: { subsampleIds: { $each: subsampleIds } } });
  },
});

// -----------------------------------------------------------------------------------
//  --------------------------       COMPONENTS      ---------------------------------
// -----------------------------------------------------------------------------------
Meteor.methods({
  'stuffs.linkComponentWithSubsamples'(subsampleId, componentIds) {
    check(subsampleId, String);
    check(componentIds, [String]);

    Stuffs.collection.update(subsampleId, { $addToSet: { componentIds: { $each: componentIds } } });
  },
});
