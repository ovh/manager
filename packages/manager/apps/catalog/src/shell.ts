let shellClient: any;

export const setShellClient = (client: any) => {
  shellClient = client;

  // set callbacks on locale change
  shellClient.i18n.onLocaleChange(() => {
    window.top.location.reload();
  });

  return shellClient;
};

export const getShellClient = () => {
  return shellClient;
};

export default { setShellClient, getShellClient };
