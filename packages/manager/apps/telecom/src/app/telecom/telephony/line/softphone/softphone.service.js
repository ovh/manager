export default class SofpthoneService {
  /* @ngInject */
  constructor($http, $q, $window, iceberg) {
    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.iceberg = iceberg;
  }

  getSoftphoneStatus(billingAccount, serviceName) {
    return this.$http
      .get(`/telephony/${billingAccount}/line/${serviceName}/softphone/status`)
      .then(({ data }) => data);
  }

  switchActivation(billingAccount, serviceName, enabled) {
    return this.$http
      .put(`/telephony/${billingAccount}/line/${serviceName}/softphone/beta`, {
        enabled,
      })
      .then(({ data }) => data);
  }

  getDevices(billingAccount, serviceName) {
    return this.$http
      .get(`/telephony/${billingAccount}/line/${serviceName}/softphone/devices`)
      .then(({ data }) => data);
  }

  deleteDevice(billingAccount, serviceName) {
    return this.$http
      .post(
        `/telephony/${billingAccount}/line/${serviceName}/softphone/devices/disconnect`,
      )
      .then(({ data }) => data);
  }

  createToken(billingAccount, serviceName, email = '') {
    return this.$http
      .post(
        `/telephony/${billingAccount}/line/${serviceName}/softphone/token`,
        {
          email,
        },
      )
      .then(({ data }) => data);
  }

  getStoreLinks() {
    return this.$http
      .get('/telephony/softphone/storeLinks')
      .then(({ data }) => data);
  }

  getThemes() {
    return this.iceberg('/telephony/softphone/themes')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }

  getSoftphoneCurrentTheme(billingAccount, serviceName) {
    return this.$http
      .get(`/telephony/${billingAccount}/line/${serviceName}/softphone/theme`)
      .then(({ data }) => data);
  }

  putSoftphoneTheme(billingAccount, serviceName, themeId) {
    return this.$http
      .put(`/telephony/${billingAccount}/line/${serviceName}/softphone/theme`, {
        themeId,
      })
      .then(({ data }) => data);
  }

  deleteSoftphoneTheme(billingAccount, serviceName) {
    return this.$http
      .delete(
        `/telephony/${billingAccount}/line/${serviceName}/softphone/theme`,
      )
      .then(({ data }) => data);
  }

  putSoftphoneLogo(billingAccount, serviceName, filename = '', url = '') {
    return this.$http
      .put(`/telephony/${billingAccount}/line/${serviceName}/softphone/logo`, {
        filename,
        url,
      })
      .then(({ data }) => data);
  }

  deleteSoftphoneLogo(billingAccount, serviceName) {
    return this.$http
      .delete(`/telephony/${billingAccount}/line/${serviceName}/softphone/logo`)
      .then(({ data }) => data);
  }

  putSoftphoneLogoGlobally(billingAccount, filename = '', url = '') {
    return this.$http
      .put(`/telephony/${billingAccount}/softphone/logo`, {
        filename,
        url,
      })
      .then(({ data }) => data);
  }

  deleteSoftphoneLogoGlobally(billingAccount) {
    return this.$http
      .delete(`/telephony/${billingAccount}/softphone/logo`)
      .then(({ data }) => data);
  }

  putSoftphoneThemeGlobally(billingAccount, themeId) {
    return this.$http
      .put(`/telephony/${billingAccount}/softphone/theme`, {
        themeId,
      })
      .then(({ data }) => data);
  }

  getSoftphoneCurrentGlobalTheme(billingAccount) {
    return this.$http
      .get(`/telephony/${billingAccount}/softphone/theme`)
      .then(({ data }) => data);
  }

  getLogo(billingAccount, serviceName) {
    return this.$http
      .get(`/telephony/${billingAccount}/line/${serviceName}/softphone/logo`)
      .then(({ data }) => data);
  }

  getGlobalLogo(billingAccount) {
    return this.$http
      .get(`/telephony/${billingAccount}/softphone/logo`)
      .then(({ data }) => data);
  }

  uploadDocument(file) {
    let globalGetUrl = null;
    const createDocument = () =>
      this.$http
        .post('/me/document', {
          name: file.name,
        })
        .then(({ data }) => data);

    const applyCors = () =>
      this.$http.post('/me/document/cors', {
        origin: this.$window.location.origin,
      });

    const saveDocumentFile = (putUrl) =>
      this.$http
        .put(putUrl, file, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        })
        .then(() => globalGetUrl);

    return createDocument().then(({ putUrl, getUrl }) => {
      globalGetUrl = getUrl;
      return applyCors().then(() => saveDocumentFile(putUrl));
    });
  }
}
