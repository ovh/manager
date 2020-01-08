angular.module('App').constant('DEDICATED_CLOUD_DATACENTER', {
  alertId: 'dedicatedCloudDatacenterAlert',
  elementTypes: {
    host: {
      planFamily: 'host-hourly',
    },
    datastore: {
      planFamily: 'datastore-hourly',
    },
  },
});
