const moment = require('moment');

// Format gebruikt om de messages aan te geven
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;