import JSURL from 'jsurl';
import each from 'lodash/each';
import map from 'lodash/map';
import 'moment';

export default class MicrosoftOfficeLicenseService {
  /* @ngInject */
  constructor(
    $cacheFactory,
    $http,
    $q,
    $translate,
    $window,
    constants,
    OvhHttp,
    Poll,
    WucUser,
  ) {
    this.$cacheFactory = $cacheFactory;
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.constants = constants;
    this.pollService = Poll;
    this.ovhHttp = OvhHttp;
    this.WucUser = WucUser;

    this.basePath = 'apiv6/license/office';
  }

  /**
   * Get all service
   * @param  {string} licenseId
   * @return {[string]}
   */
  get(licenseId) {
    return this.$http
      .get(`${this.basePath}/${licenseId}`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Edit the service
   * @param  {string} licenseId
   * @param  {Object} officeTenant
   * @return {[type]}
   */
  edit(licenseId, officeTenant) {
    return this.$http
      .put(`${this.basePath}/${licenseId}`, officeTenant)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Edit the password
   * @param  {string} licenseId       [description]
   * @param  {string} activationEmail [description]
   * @param  {Object} data            [description]
   * @return {Task}                 [description]
   */
  editPassword(licenseId, activationEmail, data) {
    return this.$http
      .post(
        `${this.basePath}/${licenseId}/user/${activationEmail}/changePassword`,
        data,
      )
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get service's infos
   * @param  {string} licenseId [description]
   * @return {Service}           [description]
   */
  getServiceInfos(licenseId) {
    return this.ovhHttp.get('/license/office/{serviceName}/serviceInfos', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName: licenseId,
      },
      cache: 'office.license.serviceinfos',
    });
  }

  getAvailableOptions(licenseId) {
    return this.ovhHttp.get(
      `/order/cartServiceOption/office365Prepaid/${licenseId}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Get array of user id
   * @param  {string} licenseId [description]
   * @return {[string]}           [description]
   */
  getUsers(licenseId) {
    return this.$http
      .get(`${this.basePath}/${licenseId}/user`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get licence model
   * @return {Object} [description]
   */
  getLicenses() {
    return this.$http
      .get(`${this.basePath}.json`)
      .then(
        (response) => response.data.models['license.office.LicenceEnum'].enum,
      )
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get the monthly price for an office license
   * @return {Object} Price with it's currency and textual representation
   */
  getLicensePrice(licenseName) {
    return this.ovhHttp.get(`/price/license/office/${licenseName}`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Get infos of a user
   * @param  {string} licenseId [description]
   * @param  {string} userId    [description]
   * @return {Object}           [description]
   */
  getUserDetails(licenseId, userId) {
    return this.$http
      .get(`${this.basePath}/${licenseId}/user/${userId}`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  pollUserDetails(licenseId, userId, $scope) {
    const namespace = 'microsoft.office.licence.user.details';

    $scope.$on('$destroy', () => {
      this.pollService.kill({
        namespace,
      });
    });

    return this.pollService.poll(
      `${this.basePath}/${licenseId}/user/${userId}`,
      null,
      {
        scope: $scope.$id,
        successRule: {
          status: 'ok',
          taskPendingId: 0,
        },
        namespace,
      },
    );
  }

  /**
   * Add a user
   * @param {string} licenseId [description]
   * @param {Object} data      [description]
   * @return {Task}           [description]
   */
  addUser(licenseId, data) {
    return this.$http
      .post(`${this.basePath}/${licenseId}/user`, data)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  /**
   * Update a user
   * @param  {string} serviceName     [description]
   * @param  {string} activationEmail [description]
   * @param  {Object} data            [description]
   * @return {Task}                 [description]
   */
  updateUser(serviceName, activationEmail, data) {
    return this.$http
      .put(`${this.basePath}/${serviceName}/user/${activationEmail}`, data)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  /**
   * Delete a user
   * @param  {string} licenseId [description]
   * @param  {string} userId    [description]
   * @return {Task}           [description]
   */
  deleteUser(licenseId, userId) {
    return this.$http
      .delete(`${this.basePath}/${licenseId}/user/${userId}`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get array of domain id
   * @param  {string} licenseId [description]
   * @return {[string]}           [description]
   */
  getDomainsId(licenseId) {
    return this.$http
      .get(`${this.basePath}/${licenseId}/domain`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get a domain
   * @param  {string} licenseId [description]
   * @param  {string} domain    [description]
   * @return {Object}           [description]
   */
  getDomain(licenseId, domain) {
    return this.$http
      .get(`${this.basePath}/${licenseId}/domain/${domain}`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get statistic of a license
   * @param  {Object} opts [description]
   * @return {Object}      [description]
   */
  consumption(opts) {
    const dataByLicense = {};
    const stat = {
      options: {
        exporting: {
          enabled: false,
        },
      },
      series: [],
      title: {
        text: this.$translate.instant('microsoft_office_license_usage_stats'),
      },
      xAxis: {
        type: 'datetime',
        min: moment(opts.from).format('x'),
        max: moment(opts.to).format('x'),
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: this.$translate.instant('microsoft_office_license_peakcount'),
        },
      },
    };

    return this.$http
      .get(`${this.basePath}/${opts.serviceName}/usageStatistics`, {
        params: {
          from: opts.from,
          to: opts.to,
        },
      })
      .then((response) => {
        const series = response.data;

        each(series.reverse(), (oneDay) => {
          each(oneDay.lines, (line) => {
            if (!dataByLicense[line.licenceType]) {
              dataByLicense[line.licenceType] = [];
            }

            dataByLicense[line.licenceType].push([
              new Date(oneDay.date).getTime(),
              line.peakCount,
            ]);
          });
        });

        stat.series = map(dataByLicense, (value, oneLicense) => ({
          id: oneLicense,
          name: this.$translate.instant(
            `microsoft_office_license_${oneLicense}_serie_name`,
          ),
          data: value,
        }));

        return stat;
      })
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Redirect to the express order page
   * @param {String} licenseType [the type of office license to buy]
   * @param {Number} number [the number of office licenses to buy]
   */
  gotToOrderPrepaidLicenses(licenseId, licenseType, number) {
    const answer = [
      {
        planCode: licenseType,
        productId: 'office365Prepaid',
        serviceName: licenseId,
        quantity: number,
      },
    ];

    this.WucUser.getUrlOfEndsWithSubsidiary('express_order').then(
      (expressOrderUrl) => {
        this.$window.open(
          `${expressOrderUrl}#/new/express/resume?products=${JSURL.stringify(
            answer,
          )}`,
          '_blank',
        );
      },
    );
  }

  static getLoginConditions() {
    return {
      minLength: 3,
      maxLength: 20,
      loginPattern: /^(?!\.)(?:[-!#$%&'^_`{}~A-Za-z\d]|\.(?!\.))+(?!\.)$/,
    };
  }

  getLoginConditionsMessage() {
    const conditions = this.constructor.getLoginConditions();
    return `${this.$translate.instant(
      'microsoft_office_license_add_user_login_conditions',
      { t0: conditions.minLength, t1: conditions.maxLength },
    )}
                ${this.$translate.instant(
                  'microsoft_office_license_add_user_login_condition_exception',
                )}`;
  }
}
