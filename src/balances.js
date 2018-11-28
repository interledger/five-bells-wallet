const { getValue } = require('./db');

function getPendingBalance(userId, contactId, direction) {
  return getValue('SELECT SUM(amount) AS value FROM transactions WHERE user_id = $1 AND contact_id = $2 AND direction = $3 AND status = \'pending\'', [ userId, contactId, direction ]).then(val => parseInt(val || 0));
}
function getReceivable(userId, contactId) {
  return getPendingBalance(userId, contactId, 'IN');
}
function getPayable(userId, contactId) {
  return getPendingBalance(userId, contactId, 'OUT');
}
function getCurrent(userId, contactId) {
  return getValue('SELECT SUM(amount * ' +
      'CASE direction WHEN \'IN\' THEN 1 WHEN \'OUT\' THEN -1 END' +
      ') AS value FROM transactions ' +
      'WHERE user_id = $1 AND contact_id = $2 AND status = \'accepted\'',
      [ userId, contactId ]).then(val => parseInt(val || 0));
}
module.exports = {  getReceivable, getPayable, getCurrent };
