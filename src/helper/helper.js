const dateFormatter = (date) => {
  return {
    start: `${date.start.month}/${date.start.day}/${date.start.year}`,
    end: `${date.end.month}/${date.end.day}/${date.end.year}`,
  };
};

export { dateFormatter };
