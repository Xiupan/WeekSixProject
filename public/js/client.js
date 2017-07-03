var rawDate = document.getElementsByClassName('publishedAt');
var longDate;
var formattedDate;

for (var i = 0; i < rawDate.length; ++i) { // client side date formatting!
  longDate = rawDate[i].textContent;
  const now = moment(longDate)
  longDate = now.format('LLLL');
  rawDate[i].textContent = longDate
}
