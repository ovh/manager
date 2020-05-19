import Postmate from 'postmate';

const handshake = new Postmate.Model({
  updateHash: (hash) => {
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  },
});

handshake.then((parent) => {
  window.addEventListener('hashchange', () => {
    parent.emit('ovh.navigation.hashChange', window.location.hash);
  });
  // init hash
  parent.emit('ovh.navigation.hashChange', window.location.hash);
});

const uFrontendApi = {
  login: (url) =>
    handshake.then((parent) => {
      parent.emit('ovh.session.login', url);
    }),
  logout: () =>
    handshake.then((parent) => {
      parent.emit('ovh.session.logout');
    }),
  sessionSwitch: () =>
    handshake.then((parent) => {
      parent.emit('ovh.session.switch');
    }),
};

export default uFrontendApi;
