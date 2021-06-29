export const getCriteria = (property, value) =>
  value
    ? [
        {
          property,
          operator: 'is',
          value,
          title: value,
        },
      ]
    : [];

export default {
  getCriteria,
};
