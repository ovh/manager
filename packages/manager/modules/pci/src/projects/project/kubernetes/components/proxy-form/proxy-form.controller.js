import {
  DOCUMENTATION_LINK,
  MODE,
  IPTABLES,
  IPVS,
  SCHEDULER,
} from './proxy-form.constants';
import {
  isTimeoutValid,
  durationToSeconds,
  secondsToDuration,
} from './proxy-form.utils';

export default class ProxyFormController {
  /* @ngInject */
  constructor($translate, $scope) {
    this.form = null;
    this.model = null;
    this.isFormShown = true;

    this.DOCUMENTATION_LINK = DOCUMENTATION_LINK;
    this.MODE = MODE;

    this.schedulerItems = [
      { label: $translate.instant('kubernetes_proxy_form_none'), value: null },
      ...SCHEDULER.map((value) => ({ label: value, value })),
    ];

    this.watchers = [
      $scope.$watch(
        () =>
          Boolean(this.form?.tcpFinTimeout) &&
          Boolean(this.form?.tcpTimeout) &&
          Boolean(this.form?.udpTimeout),
        (isFormReady) => {
          if (isFormReady) this.initializeForm();
        },
      ),
      $scope.$watch(
        () => this.model,
        () => this.setNgModelFromModel(),
        true,
      ),
    ];
  }

  get isIPTablesMode() {
    return this.model.mode === MODE.iptables;
  }

  get isIPVSMode() {
    return this.model.mode === MODE.ipvs;
  }

  $onInit() {
    if (this.collapsible) {
      this.isFormShown = Boolean(this.ngModel);
    }
    if (this.isFormShown && !this.ngModel) {
      this.initializeModel();
    }
  }

  $onDestroy() {
    this.watchers.forEach((watcher) => watcher());
  }

  $onChanges({ ngModel }) {
    if (ngModel) {
      this.model = this.getModelFromNgModel();
    }
  }

  initializeModel() {
    this.model = {
      mode: MODE.iptables,
      values: { ...IPTABLES },
    };
  }

  initializeForm() {
    [
      this.form.tcpFinTimeout,
      this.form.tcpTimeout,
      this.form.udpTimeout,
    ].forEach((control) => {
      Object.assign(control.$validators, {
        validTimeout: isTimeoutValid,
      });
    });
  }

  getModelFromNgModel() {
    if (!this.ngModel) {
      return null;
    }
    return {
      mode: this.ngModel.mode,
      values: Object.entries(this.ngModel.values ?? {}).reduce(
        (object, [key, value]) => ({
          ...object,
          [key]:
            key === 'scheduler'
              ? this.schedulerItems.find((item) => item.value === value) ||
                this.schedulerItems[0]
              : durationToSeconds(value),
        }),
        {},
      ),
    };
  }

  setNgModelFromModel() {
    if (this.model) {
      this.ngModelCtrl.$setViewValue({
        mode: this.model.mode,
        values: Object.entries(this.model.values ?? {}).reduce(
          (object, [key, value]) => ({
            ...object,
            [key]: key === 'scheduler' ? value.value : secondsToDuration(value),
          }),
          {},
        ),
      });
    } else {
      this.ngModelCtrl.$setViewValue(null);
    }
  }

  onModeChanged() {
    if (this.isIPTablesMode) {
      this.model.values = { ...IPTABLES };
    } else if (this.isIPVSMode) {
      this.model.values = { ...IPVS };
    }
    if ('scheduler' in this.model.values) {
      [this.model.values.scheduler] = this.schedulerItems;
    }
  }

  toggleForm() {
    this.isFormShown = !this.isFormShown;
    if (this.isFormShown) {
      if (!this.ngModel) {
        this.initializeModel();
      }
    } else {
      this.model = null;
    }
  }
}
