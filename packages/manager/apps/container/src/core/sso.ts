export const initSso = (): void => {
  window.addEventListener(
    'message',
    (event) => {
      const { data } = event;
      if (
        data?.id === 'ovh-auth-redirect' &&
        event.origin === window.location.origin
      ) {
        window.location.assign(data.url);
      }
    },
    true,
  );
};

export default { initSso };
