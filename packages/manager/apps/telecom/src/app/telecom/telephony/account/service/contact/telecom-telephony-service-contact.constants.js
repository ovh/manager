angular
  .module('managerApp')
  .constant('TELEPHONY_SERVICE_CONTACT_DIRECTORY_INFO', {
    status: {
      todo: 'todo',
      error: 'error',
    },
    type: {
      delete: 'deletion',
      create: 'creation',
    },
  });
