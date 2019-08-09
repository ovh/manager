angular.module('services').service('dedicatedCloudMailingList', [
  'OvhHttp',
  function (OvhHttp) {
    this.getAvailableMailingLists = function () {
      return OvhHttp.get('/me/mailingList/availableLists', {
        rootPath: 'apiv6',
      });
    };

    this.postMailingList = function (email, mailingList) {
      return OvhHttp.post('/me/mailingList/subscribe', {
        rootPath: 'apiv6',
        data: {
          email,
          mailingList,
        },
      });
    };
  },
]);
