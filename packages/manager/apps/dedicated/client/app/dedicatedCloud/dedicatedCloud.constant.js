export const SURVEY = {
  FR: 'https://survey.ovh.com/index.php/152224?lang=fr',
  EN: 'https://survey.ovh.com/index.php/152224?lang=en',
  default: 'https://survey.ovh.com/index.php/152224?lang=en',
};

export default {
  SURVEY,
};

angular
  .module('App')
  .constant('DEDICATED_CLOUD_CONSTANTS', {
    securityOptions: ['pcidss', 'hds', 'hipaa'],
    pccNewGeneration: '2.0',
  })
  .constant('UNAVAILABLE_PCC_CODE', 400)
  .constant('VM_ENCRYPTION_KMS', {
    regex: {
      ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      sslThumbprint: /^(((([0-9]|[a-fA-F]){2}:){19})|((([0-9]|[a-fA-F]){2}:){31}))([0-9]|[a-fA-F]){2}$/,
    },
    creationTaskWaitingConfiguration:
      'Waiting for customer to configure the KMS Server...',
    waitingStatus: ['doing', 'todo'],
    endStatus: ['canceled', 'done'],
    pollingDelay: 2000,
  });
