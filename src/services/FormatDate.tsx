export const formatDate = (dateString: string): string => {
  const today = new Date();
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDate: string = `${today.getDate()}-${
    months[today.getMonth()]
  }`;
  return formattedDate;
};
