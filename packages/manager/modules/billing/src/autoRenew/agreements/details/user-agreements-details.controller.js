import filter from 'lodash/filter';
import get from 'lodash/get';

import {
  AGREEMENT_GENERIC_MORE_INFORMATIONS_URL,
  GDPR_AGREEMENTS_INFOS,
} from '../user-agreements.constant';

export default /* @ngInject */ function UserAccountAgreementsDtailsController(
  $q,
  UserAccountServicesAgreements,
  Alerter,
  agreementId,
  $translate,
  coreConfig,
  coreURLBuilder,
) {
  const CGV_AGREEMENT_ID = 1635;

  this.SUPPORT_URL = coreURLBuilder.buildURL('dedicated', '#/support');

  this.$ngInit = () => {
    this.accepted = false;
    this.loading = true;
    this.confirmed = false;
    this.alreadyAccepted = false;

    $q.all([
      UserAccountServicesAgreements.getAgreement(agreementId),
      UserAccountServicesAgreements.getContract(agreementId),
    ])
      .then(([agreement, contract]) => {
        const user = coreConfig.getUser();
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
        Alerter.error(
          $translate.instant('user_agreements_error'),
          'agreements_details_alerter',
        );
        return $q.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
  };

  this.accept = () => {
    UserAccountServicesAgreements.accept({
      ...this.agreement,
      ...this.contract,
    })
      .then(() => {
        this.accepted = true;
        Alerter.success(
          $translate.instant('user_agreement_details_success'),
          'agreements_details_alerter',
        );
      })
      .catch((err) => {
        Alerter.error(
          $translate.instant('user_agreement_details_error'),
          'agreements_details_alerter',
        );
        $q.reject(err);
      });
  };

  this.$ngInit();
}
