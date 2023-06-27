let shellClient;

export const setShellClient = (client) => {
  shellClient = client;

  // set callbacks
  // set on locale change
  shellClient.i18n.onLocaleChange(() => {
    window.top.location.reload();
  });

  return shellClient;
};

export const getShellClient = () => {
  return shellClient;
};

export default { setShellClient, getShellClient };
