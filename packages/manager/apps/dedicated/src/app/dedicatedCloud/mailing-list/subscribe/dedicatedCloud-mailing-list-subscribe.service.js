angular.module('services').service('dedicatedCloudMailingList', [
  'OvhHttp',
  function dedicatedCloudMailingListService(OvhHttp) {
    this.getAvailableMailingLists = function getAvailableMailingLists() {
      return OvhHttp.get('/me/mailingList/availableLists', {
        rootPath: 'apiv6',
      });
    };

    this.postMailingList = function postMailingList(email, mailingList) {
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
