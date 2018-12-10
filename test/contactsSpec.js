const { assert } = require('chai');
const fs = require('fs');
const db = require('../src/db');
const App = require('../src/app');

async function runSqlFile(filename) {
  const file = fs.readFileSync(filename).toString().split('\r\n');
  for (const line of file) { // eslint-disable-line no-restricted-syntax
    // console.log(line);
    await db.runSql(line); // eslint-disable-line no-await-in-loop
  }
}

describe('Contacts', function () {
  before(async function () {
    process.env.DATABASE_URL = 'postgresql://snap:snap@localhost/test';
  });

  beforeEach(async function () {
    await runSqlFile('./schema.sql');
    await runSqlFile('./fixture.sql');
    await db.runSql('DELETE FROM contacts');
    this.hubbie = {
      addClient: () => {
      },
      send: (peerName, msg, userId) => {
        this.snapSent.push({ peerName, msg, userId });
      },
      on: () => {
      },
    };
    this.snapSent = [];
    this.handler = App.makeHandler(this.hubbie);
    await new Promise(resolve => this.handler({
      headers: {
        authorization: 'Basic bWljaGllbDpxd2Vy',
      },
      url: '/contacts',
      method: 'PUT',
      on: (eventName, eventHandler) => {
        if (eventName === 'data') {
          setTimeout(() => eventHandler(JSON.stringify({
            name: 'name',
            url: 'url',
            token: 'some_token',
            trust: 5,
          })), 0);
        } else {
          setTimeout(() => eventHandler(), 0);
        }
      },
    }, {
      end: () => {
        resolve();
      },
    }));
  });

  afterEach(async function () {
    await runSqlFile('./drop.sql');
  });

  after(async function () {
    await db.close();
  });

  it('creates a contact', async function () {
    const firstContact = await db.getObject('SELECT * FROM contacts LIMIT 1');
    // console.log(this.snapSent);
    const expectedFriendRequest = {
      peerName: 'name',
      msg: JSON.stringify({
        msgType: 'FRIEND-REQUEST',
        url: 'undefined/michiel/name',
        trust: 5,
        token: JSON.parse(this.snapSent[0].msg).token,
      }),
      userId: 'michiel',
    };
    const expectedLandmarkAnnouncement = {
      peerName: 'name',
      msg: JSON.stringify({
        msgType: 'ROUTING',
        canRoute: {
          'michiel:name': 5,
          asdf: 5,
        },
      }),
      userId: 'michiel',
    };
    assert.deepEqual(this.snapSent[0], expectedFriendRequest);
    assert.deepEqual(this.snapSent[1], expectedLandmarkAnnouncement);
    assert.deepEqual(firstContact, {
      user_id: 1,
      id: 8,
      landmark: 'michiel:name',
      max: 0,
      min: -5,
      name: 'name',
      token: firstContact.token,
      url: firstContact.url,
    });
  });
});
