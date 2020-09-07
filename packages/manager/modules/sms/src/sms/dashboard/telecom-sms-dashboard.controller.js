import capitalize from 'lodash/capitalize';
import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import 'moment';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    OvhApiSms,
    TucSmsMediator,
    TucToastError,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.api = {
      sms: {
        senders: OvhApiSms.Senders().v6(),
        outgoing: OvhApiSms.Outgoing().v6(),
        incoming: OvhApiSms.Incoming().v6(),
        jobs: OvhApiSms.Jobs().v6(),
      },
    };
    this.TucSmsMediator = TucSmsMediator;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
      stats: false,
    };
    this.service = null;
    this.stats = {
      moment: {
        year: moment().year(),
        month: moment().month(),
      },
      label: {
        months: [],
        senders: [],
      },
      filter: {
        sender: null,
        month: null,
      },
      data: {
        outgoing: null,
        incoming: null,
        jobs: null,
      },
      limit: 6,
    };
    this.actions = [
      {
        name: 'compose_message',
        sref: 'sms.service.sms.compose',
        text: this.$translate.instant('sms_actions_send_sms'),
      },
      {
        name: 'recredit_options',
        sref: 'sms.service.order',
        text: this.$translate.instant('sms_actions_credit_account'),
      },
      {
        name: 'manage_recipient_new',
        sref: 'sms.service.receivers',
        text: this.$translate.instant('sms_actions_create_contact'),
      },
      {
        name: 'manage_senders',
        sref: 'sms.service.senders.add',
        text: this.$translate.instant('sms_actions_create_sender'),
      },
      {
        name: 'manage_soapi_users',
        sref: 'sms.service.users',
        text: this.$translate.instant('sms_actions_create_api_user'),
      },
      {
        name: 'manage_blacklisted_senders',
        sref: 'sms.service.receivers',
        text: this.$translate.instant('sms_actions_clean_contact_list'),
      },
      {
        name: 'create_campaign',
        sref: '',
        text: this.$translate.instant('sms_actions_create_campaign'),
      },
      {
        name: 'campaign_history',
        sref: 'sms.service.sms.outgoing',
        text: this.$translate.instant('sms_actions_campaign_history'),
      },
    ];

    this.loading.init = true;
    this.api.sms.outgoing.resetAllCache();
    this.api.sms.incoming.resetAllCache();
    return this.$q
      .all({
        senders: this.fetchSenders(),
        outgoing: this.fetchOutgoing(),
        incoming: this.fetchIncoming(),
        jobs: this.fetchJobs(),
      })
      .then((results) => {
        this.service = this.TucSmsMediator.getCurrentSmsService();
        this.stats.data.outgoing = results.outgoing.length;
        this.stats.data.incoming = results.incoming.length;
        this.stats.data.jobs = results.jobs.length;
        this.stats.label.senders = results.senders;
        this.stats.label.months = this.getPreviousMonths();
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Fetch all senders.
   * @return {Promise}
   */
  fetchSenders() {
    return this.api.sms.senders.query({
      serviceName: this.$stateParams.serviceName,
    }).$promise;
  }

  /**
   * Fetch sms outgoing.
   * @param  {Number} [month=0] number of month to subtract.
   * @return {Promise}
   */
  fetchOutgoing(month = 0) {
    return this.api.sms.outgoing.query({
      serviceName: this.$stateParams.serviceName,
      'creationDatetime.from': moment()
        .subtract(month, 'months')
        .startOf('month')
        .format(),
      'creationDatetime.to': moment()
        .subtract(month, 'months')
        .endOf('month')
        .format(),
    }).$promise;
  }

  /**
   * Fetch sms incoming.
   * @param  {Number} [month=0] number of month to subtract.
   * @return {Promise}
   */
  fetchIncoming(month = 0) {
    return this.api.sms.incoming.query({
      serviceName: this.$stateParams.serviceName,
      'creationDatetime.from': moment()
        .subtract(month, 'months')
        .startOf('month')
        .format(),
      'creationDatetime.to': moment()
        .subtract(month, 'months')
        .endOf('month')
        .format(),
    }).$promise;
  }

  /**
   * Fetch all sms jobs.
   * @return {Promise}
   */
  fetchJobs() {
    return this.api.sms.jobs.query({
      serviceName: this.$stateParams.serviceName,
    }).$promise;
  }

  /**
   * Get previous months helper.
   * @return {Array}
   */
  getPreviousMonths() {
    const monthsAvailable = [];
    for (let i = 1; i <= this.stats.limit; i += 1) {
      monthsAvailable.push({
        index: this.stats.moment.month - i,
        name: capitalize(
          moment()
            .month(this.stats.moment.month - i)
            .format('MMMM'),
        ),
        fromYear: moment()
          .month(this.stats.moment.month - i)
          .format('YYYY'),
      });
    }
    return monthsAvailable;
  }

  /**
   * Get stats.
   * @param  {Object} sender filter by sender.
   * @return {Promise}
   */
  getStats(sender) {
    const offset =
      this.stats.moment.month -
      (this.stats.filter.month ? this.stats.filter.month : moment().month());
    this.api.sms.outgoing.resetAllCache();
    this.api.sms.incoming.resetAllCache();
    this.loading.stats = true;
    return this.$q
      .all({
        outgoing: this.fetchOutgoing(offset),
        incoming: this.fetchIncoming(offset),
      })
      .then((results) => {
        if (sender) {
          return this.$q
            .all(
              map(chunk(results.outgoing, 50), (id) =>
                this.api.sms.outgoing
                  .getBatch({
                    serviceName: this.$stateParams.serviceName,
                    id,
                  })
                  .$promise.catch((err) => this.TucToastError(err)),
              ),
            )
            .then((chunkResult) => map(flatten(chunkResult), 'value'))
            .then((sms) => {
              this.stats.data.outgoing = filter(sms, { sender }).length;
              this.stats.data.incoming = 0;
            })
            .catch((err) => this.TucToastError(err));
        }
        this.stats.data.outgoing = results.outgoing.length;
        this.stats.data.incoming = results.incoming.length;
        return null;
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.stats = false;
      });
  }
}
