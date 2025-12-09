export const getBulkActionMessage = (messages = []) => {
  return `<ul>
    ${messages
      .map((message) => `<li>${message.id}: ${message.message}</li>`)
      .join('')}
  </ul>`;
};

export const revertFailedBulkAction = (
  services,
  messages = [],
  revert = () => {},
) => {
  messages.forEach((message) => {
    const service = services.find((s) => s.serviceId === message.id);
    if (service) {
      revert(service);
    }
  });
};

export const mapErrorsForBulkActions = (results) => {
  const errors = results.filter((result) => result?.type === 'ERROR');

  if (errors.length > 0) {
    return this.$q.reject({
      messages: errors,
      state: 'PARTIAL',
    });
  }

  return {
    messages: [],
    state: 'OK',
  };
};
