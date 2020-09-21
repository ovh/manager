import filter from 'lodash/filter';
import get from 'lodash/get';

angular
  .module('UserAccount')
  .controller('UserAccount.controllers.agreements.details', [
    '$q',
    'UserAccountServicesAgreements',
    'Alerter',
    'agreementId',
    '$translate',
    'User',
    'GDPR_AGREEMENTS_INFOS',
    'AGREEMENT_GENERIC_MORE_INFORMATIONS_URL',
    function UserAccountAgreementsDtailsController(
      $q,
      Service,
      Alerter,
      agreementId,
      $translate,
      User,
      GDPR_AGREEMENTS_INFOS,
      AGREEMENT_GENERIC_MORE_INFORMATIONS_URL,
    ) {
      const CGV_AGREEMENT_ID = 1635;

      this.$ngInit = () => {
        this.accepted = false;
        this.loading = true;
        this.confirmed = false;
        this.alreadyAccepted = false;

        $q.all([
          Service.getAgreement(agreementId),
          Service.getContract(agreementId),
          User.getUser(),
        ])
          .then(([agreement, contract, user]) => {
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
        Service.accept({
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
    },
  ]);
