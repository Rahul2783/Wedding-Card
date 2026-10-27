/**
 * Calendar Utilities for Add to Calendar functionality
 */

export function generateGoogleCalendarUrl(event, venueName, venueAddress) {
  // ISO date format YYYYMMDDTHHmmssZ
  const formatUtc = (dateStr) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatUtc(event.startDate);
  const end = formatUtc(event.endDate);
  const title = encodeURIComponent(`॥ शुभ विवाह ॥ ${event.titleHi} (${event.titleEn}) — सचिन साहू & अंजलि साहू`);
  const details = encodeURIComponent(
    `${event.descriptionHi}\n${event.descriptionEn}\n\nSachin Sahu (Shani) & Anjali Sahu Wedding Celebrations.`
  );
  const location = encodeURIComponent(`${venueName}, ${venueAddress}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function downloadIcsFile(event, venueName, venueAddress) {
  const formatUtc = (dateStr) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatUtc(event.startDate);
  const end = formatUtc(event.endDate);
  const now = formatUtc(new Date().toISOString());

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sachin and Anjali Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${event.id}-${Date.now()}@sachinanjali.wedding`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:॥ शुभ विवाह ॥ ${event.titleHi} (${event.titleEn})`,
    `DESCRIPTION:${event.descriptionHi} - ${event.descriptionEn}`,
    `LOCATION:${venueName}, ${venueAddress}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.id}-sachin-anjali-wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
