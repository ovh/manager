import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */
function userService($http, $q, constants, coreConfig, OvhHttp) {
  this.getUser = () => {
    const user = coreConfig.getUser();
    const webUser = {
      nichandle: user.nichandle,
      email: user.email,
      firstName: user.firstname,
      lastName: user.name,
      billingCountry: user.country,
      ovhSubsidiary: user.ovhSubsidiary,
      spareEmail: user.spareEmail,
    };
    return $q.when(webUser);
  };

  this.getUrlOf = (link) =>
    this.getUser().then((data) => {
      if (
        has(constants, 'urls') &&
        constants.urls[data.ovhSubsidiary] != null &&
        constants.urls[data.ovhSubsidiary][link] != null
      ) {
        return constants.urls[data.ovhSubsidiary][link];
      }

      return get(constants, `urls.FR.${link}`);
    });

  /* The new structure in constants.config.js will be ...value.subsidiary and not subsidiary.value
   * It will be easier for maintainers when you see all
   * the possible values for a constant at the same place
   * If constants are structured the old way, use getUrlOf
   */
  this.getUrlOfEndsWithSubsidiary = (link) =>
    this.getUser().then((data) => {
      if (
        has(constants, 'urls') &&
        constants.urls[link] != null &&
        constants.urls[link][data.ovhSubsidiary] != null
      ) {
        return constants.urls[link][data.ovhSubsidiary];
      }

      return constants.urls.FR[link];
    });

  this.uploadFile = (filename, file, tags) => {
    if (filename == null || filename === '' || isEmpty(file.name)) {
      throw new Error("File doesn't have a name");
    }

    let idFile;
    let documentResponse;

    const filenameSplitted = file.name.split('.');
    const fileNameExtension = filenameSplitted[filenameSplitted.length - 1];
    const givenFilenameSplitted = filename.split('.');
    const givenFilenameExtension =
      givenFilenameSplitted[givenFilenameSplitted.length - 1];

    let finalExtension = '';
    if (fileNameExtension !== givenFilenameExtension) {
      finalExtension = `.${fileNameExtension}`;
    }

    const params = {
      name: `${filename}${finalExtension}`,
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

  this.getDocument = (id) =>
    $http.get(`apiv6/me/document/${id}`).then((response) => response.data);

  this.getDocumentIds = () =>
    $http.get('apiv6/me/document').then((response) => response.data);

  this.getDocuments = () =>
    this.getDocumentIds().then((data) => {
      const queries = data.map(this.getDocument);

      return $q.all(queries);
    });

  this.payWithRegisteredPaymentMean = (opts) =>
    OvhHttp.post('/me/order/{orderId}/payWithRegisteredPaymentMean', {
      rootPath: 'apiv6',
      urlParams: {
        orderId: opts.orderId,
      },
      data: {
        paymentMean: opts.paymentMean,
      },
    });
}
