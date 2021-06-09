import get from 'lodash/get';

import {
  JSPLUMB_INSTANCE_OPTIONS,
  JSPLUMB_ENDPOINTS_OPTIONS,
  JSPLUMB_CONNECTIONS_OPTIONS,
} from '../../number.constants';

export default class OvhPabxCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $translatePartialLoader,
    asyncLoader,
    TelephonyMediator,
    tucJsPlumbService,
    TucToast,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$translatePartialLoader = $translatePartialLoader;
    this.asyncLoader = asyncLoader;
    this.TelephonyMediator = TelephonyMediator;
    this.TucToast = TucToast;

    this.popoverDatas = {
      isOpen: false,
      configType: null,
    };

    this.loading = {
      dialplan: false,
      translations: false,
    };

    this.ovhPabx = null;
    this.dialplan = null;
    this.jsPlumbInstanceOptions = JSPLUMB_INSTANCE_OPTIONS;
    this.jsPlumbEndpointsOptions = JSPLUMB_ENDPOINTS_OPTIONS;
    this.jsPlumbConnectionsOptions = JSPLUMB_CONNECTIONS_OPTIONS;
  }

  $onInit() {
    let initPromises;

    // set loading
    this.numberCtrl.loading.feature = true;

    // set ovhPabx
    this.ovhPabx = this.numberCtrl.number.feature;

    return this.getTranslations()
      .then(() => {
        initPromises = [
          this.ovhPabx.getDialplans(),
          this.ovhPabx.getSounds(),
          this.TelephonyMediator.getAll(),
        ];

        if (
          this.ovhPabx.featureType === 'cloudIvr' ||
          this.ovhPabx.featureType === 'contactCenterSolutionExpert'
        ) {
          initPromises.push(this.ovhPabx.getMenus(true));
        }
        if (this.ovhPabx.featureType !== 'cloudIvr') {
          initPromises.push(this.ovhPabx.getQueues());
          if (this.ovhPabx.isCcs()) {
            initPromises.push(this.ovhPabx.getTts());
          }
        }

        return this.$q.allSettled(initPromises);
      })
      .then(() => {
        this.refreshDisplayedDialplan();
        this.displayedFeatureType();
      })
      .finally(() => {
        this.numberCtrl.loading.feature = false;
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant(
            'telephony_number_feature_ovh_pabx_load_error',
          ),
        );
        return this.$q.reject(error);
      });
  }

  refreshDisplayedDialplan() {
    // for the moment it will only have one dialplan per ovhPabx. So we take the first.
    this.dialplan = get(this.numberCtrl.number.feature.dialplans, '[0]');
  }

  displayedFeatureType() {
    const { featureType } = this.numberCtrl.number.feature;
    this.asyncLoader.addTranslations(
      import(
        `./types/${featureType}/translations/Messages_${this.$translate.use()}.json`
      )
        .catch(() =>
          import(
            `./types/${featureType}/translations/Messages_${this.$translate.fallbackLanguage()}.json`
          ),
        )
        .then((x) => x.default),
    );
    this.$translate.refresh();
  }

  /* ----------  Translations load  ----------*/

  getTranslations() {
    this.loading.translations = true;

    // load ovhPabx translations
    this.$translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number/feature/ovhPabx',
    );

    // load time condition slot transations
    this.$translatePartialLoader.addPart(
      '../components/telecom/telephony/timeCondition/slot',
    );

    // load specific types translations
    this.$translatePartialLoader.addPart(
      `../components/telecom/telephony/group/number/feature/ovhPabx/types/${this.ovhPabx.featureType}`,
    );
    return this.$translate.refresh().finally(() => {
      this.loading.translations = false;
    });
  }
}
