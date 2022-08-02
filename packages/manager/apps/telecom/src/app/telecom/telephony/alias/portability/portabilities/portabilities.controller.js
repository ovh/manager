import {
  PORTABILITY_STATUS,
  PORTABILITY_STEPS_GUIDE,
  PORTABILITY_COUNTRY,
  PORTABILITY_STEPS_STATUS,
} from './portabilities.constants';

export default class TelecomTelephonyAliasPortabilitiesCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    TucToast,
    TelephonyPortabilitiesService,
  ) {
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.TucToast = TucToast;
    this.TelephonyPortabilitiesService = TelephonyPortabilitiesService;
    this.PORTABILITY_STEPS_GUIDE = PORTABILITY_STEPS_GUIDE;
    this.PORTABILITY_STEPS_STATUS = PORTABILITY_STEPS_STATUS;
  }

  $onInit() {
    this.isLoading = true;
    this.collapseStatus = null;

    return this.TelephonyPortabilitiesService.fetchPortability(
      this.$stateParams.billingAccount,
    )
      .then((result) => {
        this.numbers = this.groupPortabilityByNumbers(result);
        this.guideStepUrl = this.selectGuides();
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('telephony_alias_portabilities_load_error', {
            error: error?.data?.message,
          }),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.collapseStatus = Object.keys(this.numbers).map(() => false);
        this.isLoading = false;
      });
  }

  toggleAccordion(collapsId) {
    this.collapseStatus[collapsId] = this.collapseStatus[collapsId] === false;
  }

  checkPortabilityStatus(index) {
    // If portability first step is toDo, lastStepDone isn't initialized
    if (!this.numbers[index].lastStepDone) {
      return false;
    }

    return [
      PORTABILITY_STATUS.formSent,
      PORTABILITY_STATUS.formReceived,
    ].includes(this.numbers[index].lastStepDone.name);
  }

  groupPortabilityByNumbers = function groupPortabilityByNumbers(
    portabilities,
  ) {
    return portabilities.flatMap((portability) =>
      portability.numbersList.map((number) => ({
        number,
        portability,
        lastStepDone: portability.steps
          .slice()
          .reverse()
          .find((step) => step.status === this.PORTABILITY_STEPS_STATUS.done),
      })),
    );
  };

  selectGuides() {
    const portaFr = this.numbers.filter(
      (porta) =>
        porta.portability.portabilityCountry === PORTABILITY_COUNTRY.FR,
    );

    const portaBe = this.numbers.filter(
      (porta) =>
        porta.portability.portabilityCountry === PORTABILITY_COUNTRY.BE,
    );

    return portaFr.length >= portaBe.length
      ? PORTABILITY_STEPS_GUIDE.FR
      : PORTABILITY_STEPS_GUIDE.BE;
  }
}
