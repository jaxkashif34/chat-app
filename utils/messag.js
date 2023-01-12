const f = Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});
const formatMsg = ({ userName, text }) => {
  return {
    userName,
    text,
    time: f.format(new Date()),
  };
};

module.exports = { formatMsg };
