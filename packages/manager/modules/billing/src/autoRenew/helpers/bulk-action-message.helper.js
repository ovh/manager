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
