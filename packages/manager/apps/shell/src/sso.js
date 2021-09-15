const initSso = () => {
  window.addEventListener(
    'message',
    ({ data }) => {
      if (data && data.id === 'ovh-auth-redirect') {
        window.location.assign(data.url);
      }
    },
    true,
  );
};

export default initSso;
