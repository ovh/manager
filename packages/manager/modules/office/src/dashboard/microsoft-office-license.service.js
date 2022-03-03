import JSURL from 'jsurl';
import each from 'lodash/each';
import map from 'lodash/map';
import 'moment';
import {
  PREPAID_BASE_URL,
  POSTPAID_BASE_URL,
} from './microsoft-office-license.constants';

export default class MicrosoftOfficeLicenseService {
  /* @ngInject */
  constructor(
    $cacheFactory,
    $http,
    $q,
    $translate,
    $window,
    constants,
    MicrosoftOfficeLicensePrepaidService,
    MicrosoftOfficeLicensePostpaidService,
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
    this.licensePrepaidService = MicrosoftOfficeLicensePrepaidService;
    this.licensePostpaidService = MicrosoftOfficeLicensePostpaidService;
    this.pollService = Poll;
    this.ovhHttp = OvhHttp;
    this.WucUser = WucUser;
  }

  static isPrepaidService(serviceName) {
    return serviceName && serviceName.includes('-');
  }

  /**
   * Get all service
   * @param  {string} licenseId
   * @return {[string]}
   */
  get(licenseId) {
    const promise = MicrosoftOfficeLicenseService.isPrepaidService(licenseId)
      ? this.licensePrepaidService.get(licenseId)
      : this.licensePostpaidService.get(licenseId);
    return promise
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
    const promise = MicrosoftOfficeLicenseService.isPrepaidService(licenseId)
      ? this.licensePrepaidService.edit(licenseId, officeTenant)
      : this.licensePostpaidService.edit(licenseId, officeTenant);
    return promise
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
    const promise = MicrosoftOfficeLicenseService.isPrepaidService(licenseId)
      ? this.licensePrepaidService.updatePassword(licenseId, data)
      : this.licensePostpaidService.updatePassword(
          licenseId,
          activationEmail,
          data,
        );
    return promise
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get service's infos
   * @param  {string} licenseId [description]
   * @return {Service}           [description]
   */
  getServiceInfos(licenseId) {
    return MicrosoftOfficeLicenseService.isPrepaidService(licenseId)
      ? this.licensePrepaidService.getServiceInfos(licenseId)
      : this.licensePostpaidService.getServiceInfos(licenseId);
  }

  createCart(ovhSubsidiary) {
    return this.$http
      .post('apiv6/order/cart', { ovhSubsidiary })
      .then(({ data }) => data);
  }

  getOfficePrepaidPlans(cartId) {
    return this.$http
      .get(`apiv6/order/cart/${cartId}/officePrepaid`)
      .then(({ data }) => data);
  }

  getAvailableOptions() {
    return this.WucUser.getUser()
      .then(({ ovhSubsidiary }) => this.createCart(ovhSubsidiary))
      .then(({ cartId }) => this.getOfficePrepaidPlans(cartId))
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get array of user id
   * @param  {string} licenseId [description]
   * @return {[string]}           [description]
   */
  getUsers(licenseId) {
    const [tenant] = licenseId.split('-');
    const promise =
      tenant === licenseId
        ? this.licensePostpaidService.getUsers(licenseId)
        : this.licensePrepaidService.getUsers(tenant);
    return promise
      .then((data) => data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get licence model
   * @return {Object} [description]
   */
  getLicenses() {
    return this.$http
      .get(`${POSTPAID_BASE_URL}.json`)
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
    const promise = MicrosoftOfficeLicenseService.isPrepaidService(licenseId)
      ? this.licensePrepaidService.getUserDetails(userId)
      : this.licensePostpaidService.getUserDetails(licenseId, userId);
    return promise
      .then((data) => data)
      .catch((err) => this.$q.reject(err.data));
  }

  pollUserDetails(licenseId, userId, $scope) {
    const namespace = 'microsoft.office.licence.user.details';
    const pollUrl = MicrosoftOfficeLicenseService.isPrepaidService(licenseId)
      ? `${PREPAID_BASE_URL}/${userId}`
      : `${POSTPAID_BASE_URL}/${licenseId}/user/${userId}`;

    $scope.$on('$destroy', () => {
      this.pollService.kill({
        namespace,
      });
    });

    return this.pollService.poll(pollUrl, null, {
      scope: $scope.$id,
      successRule: {
        status: 'ok',
        taskPendingId: 0,
      },
      namespace,
    });
  }

  /**
   * Add a user
   * @param {string} licenseId [description]
   * @param {Object} data      [description]
   * @return {Task}           [description]
   */
  addUser(licenseId, data) {
    return this.$http
      .post(`${POSTPAID_BASE_URL}/${licenseId}/user`, data)
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
    const promise = MicrosoftOfficeLicenseService.isPrepaidService(serviceName)
      ? this.licensePrepaidService.updateUser(serviceName, data)
      : this.licensePostpaidService.updateUser(
          serviceName,
          activationEmail,
          data,
        );
    return promise
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
    const promise = MicrosoftOfficeLicenseService.isPrepaidService(licenseId)
      ? this.licensePrepaidService.deleteUser(licenseId)
      : this.licensePostpaidService.deleteUser(licenseId, userId);
    return promise
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
      .get(`${POSTPAID_BASE_URL}/${licenseId}/domain`)
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
      .get(`${POSTPAID_BASE_URL}/${licenseId}/domain/${domain}`)
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

    const promise = MicrosoftOfficeLicenseService.isPrepaidService(
      opts.serviceName,
    )
      ? this.licensePrepaidService.getUsage(opts)
      : this.licensePostpaidService.getUsage(opts);
    return promise
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
   * @param {String} planCode [the type of office license to buy]
   * @param {Number} number [the number of office licenses to buy]
   */
  gotToOrderPrepaidLicenses(
    tenantName,
    planCode,
    number,
    duration,
    pricingMode,
  ) {
    const answer = [
      {
        configuration: [
          {
            label: 'existing_tenant_service_name',
            value: tenantName,
          },
        ],
        duration,
        planCode,
        pricingMode,
        productId: 'officePrepaid',
        quantity: number,
      },
    ];

    this.WucUser.getUrlOfEndsWithSubsidiary('express_order').then(
      (expressOrderUrl) => {
        this.$window.open(
          `${expressOrderUrl}#/express/review?products=${JSURL.stringify(
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
