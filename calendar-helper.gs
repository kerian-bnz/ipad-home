// Paste into script.google.com (New project), then Deploy > New deployment > Web app,
// Execute as: Me, Who has access: Anyone. Copy the /exec URL into the dashboard Settings.
// Anyone holding that URL can read your next 7 days of event titles: keep it private.
function doGet() {
  var now = new Date(), end = new Date(now.getTime() + 7 * 864e5);
  var events = [];
  CalendarApp.getAllCalendars().forEach(function (cal) {
    if (!cal.isSelected()) return; // only calendars ticked in Google Calendar
    cal.getEvents(now, end).forEach(function (e) {
      events.push({ title: e.getTitle(), start: e.getStartTime().toISOString(), allDay: e.isAllDayEvent() });
    });
  });
  events.sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  return ContentService.createTextOutput(JSON.stringify(events)).setMimeType(ContentService.MimeType.JSON);
}
