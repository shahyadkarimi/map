const dateFormatter = (date, time) => {
  return {
    start: `${date.start.month}/${date.start.day}/${date.start.year} ${time.hour}:${time.minute}`,
    end: `${date.end.month}/${date.end.day}/${date.end.year} ${time.hour}:${time.minute}`,
  };
};

export { dateFormatter };
