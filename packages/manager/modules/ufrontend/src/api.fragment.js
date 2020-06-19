import getFrontend from './frontend';
import getMessenger from './messenger';

const frontend = getFrontend();
const messenger = getMessenger();

const createFragmentApi = (id) => ({
  messenger: {
    on: (message, callback) => messenger.on(id, message, callback),
    emit: (message, data) => messenger.emit(id, message, data),
  },
});

const registerFragment = (id, installFragment) =>
  frontend
    .getTemplate()
    .then((template) => {
      const element = template.querySelector(`[data-fragment=${id}]`);
      if (!element) {
        throw new Error(
          `Missing data-fragment element in template for fragment '${id}'`,
        );
      }
      if (!(installFragment instanceof Function)) {
        throw new Error(
          `Given callback to install fragment '${id}' is not a function`,
        );
      }
      const fragmentApi = createFragmentApi(id);
      return frontend
        .getConfig()
        .then((config) =>
          installFragment({ element, config, api: fragmentApi }),
        )
        .then(() => frontend.setFragment(id))
        .then(() => fragmentApi);
    })
    .catch((error) => {
      console.error(
        `Exception raised when registering fragment '${id}':`,
        error,
      );
      throw error;
    });

export default registerFragment;
