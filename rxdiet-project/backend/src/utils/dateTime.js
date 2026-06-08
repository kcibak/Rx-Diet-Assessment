// Provides small date helpers used by session creation and expiration checks.
// The functions keep time arithmetic and invalid-date handling out of service code.
function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function isExpired(value) {
  const ts = new Date(value).getTime();

  if (Number.isNaN(ts)) {
    return true;
  }

  return ts <= Date.now();
}

module.exports = {
  addDays,
  isExpired,
};
