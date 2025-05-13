import { User } from '@ovh-ux/manager-models';

angular.module('services').service(
  'User',
  /* @ngInject */
  function userF($http, $q, constants, coreConfig, OvhHttp) {
    const self = this;
    let user = null;
    let userPromise;
    let userPromiseRunning = false;

    this.getUser = function getUser() {
      if (!userPromiseRunning && user === null) {
        userPromiseRunning = true;

        userPromise = $q.when('start').then(() =>
          $q
            .all({
              me: coreConfig.getUser(),
              certificates: coreConfig.getUser().certificates,
            })
            .then((result) => {
              userPromiseRunning = false;

              if (result) {
                user = new User(
                  {
                    ...result.me,
                    firstName: result.me.firstname,
                    lastName: result.me.name,
                    billingCountry: result.me.country,
                    customerCode: result.me.customerCode,
                  },
                  result.certificates,
                );
              }
            }),
        );
      }

      return userPromise.then(
        () => user,
        (error) => $q.reject(error),
      );
    };

    this.getUser();

    this.getUrlOf = function getUrlOf(link) {
      return this.getUser().then((data) => {
        try {
          return constants.urls[data.ovhSubsidiary][link];
        } catch (exception) {
          return constants.urls.FR[link];
        }
      });
    };

    /**
     * The new structure in constants.config.js will be ...value.subsidiary and not subsidiary.value
     * It will be easier for maintainers when you see all the possible values for a constant at
     * the same place
     * If constants are structured the old way, use getUrlOf
     */
    this.getUrlOfEndsWithSubsidiary = function getUrlOfEndsWithSubsidiary(
      link,
    ) {
      return this.getUser().then((data) => {
        try {
          return constants.urls[link][data.ovhSubsidiary];
        } catch (exception) {
          return constants.urls[link].FR;
        }
      });
    };

    this.getSshKeys = function getSshKeys() {
      return OvhHttp.get('/me/sshKey', {
        rootPath: 'apiv6',
      });
    };

    this.uploadFile = function uploadFile(filename, file, tags) {
      let idFile;
      let documentResponse;

      const filenameSplitted = file.name.split('.');
      const params = {
        name: [filename, filenameSplitted[filenameSplitted.length - 1]].join(
          '.',
        ),
      };

      if (tags) {
        angular.extend(params, { tags });
      }

      return $http
        .post('apiv6/me/document', params)
        .then((response) => {
          documentResponse = response;

          return $http.post('apiv6/me/document/cors', {
            origin: window.location.origin,
          });
        })
        .then(() => {
          idFile = documentResponse.data.id;
          return $http.put(documentResponse.data.putUrl, file, {
            serviceType: 'external',
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        })
        .then(() => idFile);
    };

    this.getDocument = function getDocument(id) {
      return $http.get(`apiv6/me/document/${id}`).then(({ data }) => data);
    };

    this.getDocumentIds = function getDocumentIds() {
      return $http.get('apiv6/me/document').then(({ data }) => data);
    };

    this.getDocuments = function getDocuments() {
      return self.getDocumentIds().then((data) => {
        const queries = data.map(self.getDocument);

        return $q.all(queries);
      });
    };

    this.payWithRegisteredPaymentMean = function payWithRegisteredPaymentMean(
      opts,
    ) {
      return OvhHttp.post('/me/order/{orderId}/payWithRegisteredPaymentMean', {
        rootPath: 'apiv6',
        urlParams: {
          orderId: opts.orderId,
        },
        data: {
          paymentMean: opts.paymentMean,
        },
      });
    };

    this.getValidPaymentMethodIds = function getValidPaymentMethodIds() {
      return $http
        .get(`${constants.swsProxyRootPath}me/payment/method`)
        .then(({ data }) => data);
    };
  },
);
