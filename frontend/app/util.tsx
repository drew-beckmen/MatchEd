export function convertUTCToLocalTimeString(utcTimeString: string) {
  const utcDate = new Date(utcTimeString);

  // Format the date with local time
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  const localTimeString = new Intl.DateTimeFormat("en-US", options).format(
    utcDate,
  );

  return localTimeString;
}
