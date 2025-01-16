import { SOFTPHONE_TYPE } from './softphone.constants';

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

  modifyDevice(billingAccount, serviceName, name, deviceId) {
    return this.$http
      .put(
        `/telephony/${billingAccount}/line/${serviceName}/softphone/devices/${deviceId}`,
        {
          name,
        },
      )
      .then(({ data }) => data);
  }

  deleteAllDevices(billingAccount, serviceName) {
    this.getDevicesInfos(billingAccount, serviceName)
      .then((devices) => {
        this.$q.all(
          devices.map((device) =>
            this.$http.delete(
              `/telephony/${billingAccount}/line/${serviceName}/softphone/devices/${device.id}`,
            ),
          ),
        );
      })
      .then(({ data }) => data);
  }

  deleteDevice(billingAccount, serviceName, deviceId) {
    return this.$http
      .delete(
        `/telephony/${billingAccount}/line/${serviceName}/softphone/devices/${deviceId}`,
      )
      .then(({ data }) => data);
  }

  createDevice(billingAccount, serviceName, name) {
    return this.$http
      .post(
        `/telephony/${billingAccount}/line/${serviceName}/softphone/devices`,
        {
          name,
          type: SOFTPHONE_TYPE,
        },
      )
      .then(({ data }) => data);
  }

  enroll(billingAccount, serviceName, deviceId) {
    return this.$http
      .post(
        `/telephony/${billingAccount}/line/${serviceName}/devices/${deviceId}/enroll`,
      )
      .then(({ data }) => data);
  }

  sendProvisioningToken(billingAccount, serviceName, deviceId, email) {
    return this.$http
      .post(
        `/telephony/${billingAccount}/line/${serviceName}/devices/${deviceId}/sendProvisioningToken`,
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

  getSoftphoneDevices(billingAccount, serviceName) {
    return this.$http
      .get(`/telephony/${billingAccount}/line/${serviceName}/softphone/devices`)
      .then(({ data }) => data);
  }

  getSoftphoneDeviceDetail(billingAccount, serviceName, deviceId) {
    return this.$http
      .get(
        `/telephony/${billingAccount}/line/${serviceName}/softphone/devices/${deviceId}`,
      )
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

  getDevicesInfos(billingAccount, serviceName) {
    return this.iceberg(
      `/telephony/${billingAccount}/line/${serviceName}/softphone/devices`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }

  /*
   * TODO: this API is not testable inside LABEU
   * => Some tests will be needed for testing this in production
   */

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
