import last from 'lodash/last';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import merge from 'lodash/merge';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import startsWith from 'lodash/startsWith';
import words from 'lodash/words';

export default class TelecomTelephonyLineDetailsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    currentLine,
    TucNumberPlans,
    TelephonyMediator,
  ) {
    this.$q = $q;
    this.billingAccount = $stateParams.billingAccount;
    this.serviceName = $stateParams.serviceName;
    this.currentLine = currentLine;
    this.TucNumberPlans = TucNumberPlans;
    this.TelephonyMediator = TelephonyMediator;
    this.isYealinkPhone = null;
  }

  $onInit() {
    this.loading = true;
    this.lastRegistration = null;

    this.TelephonyMediator.getGroup(this.billingAccount)
      .then((group) => {
        this.group = group;
        this.line = merge(
          this.group.getLine(this.serviceName),
          this.currentLine || {},
        );
        this.line.getPublicOffer.description = this.line.getPublicOffer.description.replace(
          'The Public Reference has an error',
          '-',
        );
        this.plan = this.TucNumberPlans.getPlanByNumber(this.line);

        return this.$q
          .all({
            phone: this.line.getPhone(),
            options: this.line.getOptions(),
            ips: this.line.getIps(),
            lastRegistrations: this.line.getLastRegistrations(),
          })
          .then(() => {
            if (
              isArray(this.line.lastRegistrations) &&
              this.line.lastRegistrations.length
            ) {
              this.lastRegistration = last(
                sortBy(
                  this.line.lastRegistrations,
                  (reg) => new Date(reg.datetime),
                ),
              );
            }

            if (
              some(words(this.line.offers), (offer) =>
                includes(['sipfax', 'priceplan', 'trunk'], offer),
              )
            ) {
              this.hasSimultaneousCallsOption = true;
              this.isTrunkRates = some(this.line.offers, (offer) =>
                startsWith(offer, 'voip.main.offer.fr.trunk.rates'),
              );
            }
            if (this.line.phone) {
              this.isYealinkPhone = false;
              if (this.line.phone.brand.indexOf('yealink') > -1) {
                this.isYealinkPhone = true;
              }
            }
          });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
