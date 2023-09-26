type ShellClient = any;

let shellClient: ShellClient;

export const setShellClient = (client: ShellClient) => {
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
