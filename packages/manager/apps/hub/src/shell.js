let shellClient;

export const setShellClient = (client) => {
  shellClient = client;

  // set callbacks
  // set on locale change
  shellClient.i18n.onLocaleChange(() => {
    window.top.location.reload();
  });

  // by default show the account sidebar and disable toggle visibility
  shellClient.ux.showAccountSidebar(true);

  return shellClient;
};

export const getShellClient = () => {
  return shellClient;
};

export default { setShellClient, getShellClient };
