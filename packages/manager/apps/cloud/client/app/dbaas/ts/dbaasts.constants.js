angular.module('managerApp').constant('DBaasTsConstants', {
  guides: {
    concepts: {
      FR: 'https://www.ovh.com/fr/g2103.paas-timeseries-concepts',
    },
    WRITE: {
      FR: 'https://www.ovh.com/fr/g2099.comment-envoyer-donnees-time-series',
    },
    READ: {
      FR: 'https://www.ovh.com/fr/g2100.comment-recuperer-donnees-time-series',
    },
  },
  api: {
    WRITE: 'api/put',
    READ: 'api/query',
  },
  urls: {
    order: {
      FR: 'https://www.ovh.com/fr/dbaas/timeseries/',
      US: 'https://us.ovhcloud.com/dbaas/timeseries/',
    },
  },
});
