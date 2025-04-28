import filter from 'lodash/filter';
import get from 'lodash/get';
import {
  AGREEMENT_GENERIC_MORE_INFORMATIONS_URL,
  GDPR_AGREEMENTS_INFOS,
  SUPPORT_URL,
} from '../user-agreements.constant';

const CGV_AGREEMENT_ID = 1635;

export default class UserAccountAgreementsDetailsController {
  /* @ngInject */
  constructor(
    $q,
    UserAccountServicesAgreements,
    Alerter,
    $translate,
    coreConfig,
  ) {
    this.$q = $q;
    this.UserAccountServicesAgreements = UserAccountServicesAgreements;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.accepted = false;
    this.loading = true;
    this.confirmed = false;
    this.alreadyAccepted = false;

    this.$q
      .all([
        this.UserAccountServicesAgreements.getAgreement(this.agreementId),
        this.UserAccountServicesAgreements.getContract(this.agreementId),
      ])
      .then(([agreement, contract]) => {
        const user = this.coreConfig.getUser();
        this.SUPPORT_URL = SUPPORT_URL + user.ovhSubsidiary;
        this.agreement = agreement;
        this.contract = contract;
        this.isIndividual = user.legalform === 'individual';
        this.alreadyAccepted = this.agreement.agreed === 'ok';
        this.confirmed = this.alreadyAccepted;
        this.accepted = this.alreadyAccepted;
        this.isCGVContract = this.agreement.contractId === CGV_AGREEMENT_ID;

        this.appendicesLink = get(
          filter(
            GDPR_AGREEMENTS_INFOS,
            (el) => el.subsidiary === user.ovhSubsidiary,
          ),
          '[0].more_informations_url',
          AGREEMENT_GENERIC_MORE_INFORMATIONS_URL,
        );
      })
      .catch((err) => {
        this.Alerter.error(
          this.$translate.instant('user_agreements_error'),
          'agreements_details_alerter',
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  accept() {
    this.UserAccountServicesAgreements.accept({
      ...this.agreement,
      ...this.contract,
    })
      .then(() => {
        this.accepted = true;
        this.Alerter.success(
          this.$translate.instant('user_agreement_details_success'),
          'agreements_details_alerter',
        );
      })
      .catch((err) => {
        this.Alerter.error(
          this.$translate.instant('user_agreement_details_error'),
          'agreements_details_alerter',
        );
        this.$q.reject(err);
      });
  }
}
