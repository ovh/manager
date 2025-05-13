export default /* @ngInject */ function XdslAccessLnsRateLimitCtrl(
  $stateParams,
  $scope,
  $translate,
  OvhApiXdsl,
  TucToastError,
) {
  const self = this;

  function init() {
    self.step = 64;
    self.min = 64;
    self.max = 100032;
    self.default = self.max;
    self.doing = false;
    self.rate = {
      disabled: false,
      canApplyLnsRateLimit: false,
    };
    self.undoRate = JSON.parse(JSON.stringify(self.rate));
    self.watcher = $scope.$watch('access.xdsl', (data) => {
      if (data) {
        self.rate = {
          disabled: data.lnsRateLimit === null,
          value: data.lnsRateLimit ? data.lnsRateLimit : self.default,
          canApplyLnsRateLimit: data.capabilities.canApplyLnsRateLimit,
        };
        self.undoRate = JSON.parse(JSON.stringify(self.rate));
        self.watcher();
      }
    });
  }

  self.reformatValue = function reformatValue(value) {
    const matcher = `${value / 1024}.00`.match(/^(\d*)\.(\d{2})/);
    if (matcher) {
      return `${matcher[1]}.${matcher[2]} Mbps`;
    }
    return '';
  };

  self.valueChanged = function valueChanged() {
    return (
      self.rate.disabled !== self.undoRate.disabled ||
      self.rate.value !== self.undoRate.value
    );
  };

  self.changeRate = function changeRate() {
    if (self.rate.canApplyLnsRateLimit) {
      self.doing = true;
      OvhApiXdsl.v6().put(
        { xdslId: $stateParams.serviceName },
        { lnsRateLimit: self.rate.disabled ? null : self.rate.value },
        () => {
          self.doing = false;
          $scope.access.tasks.current.lnsApplyRateLimit = true;
          self.undoRate = JSON.parse(JSON.stringify(self.rate));
        },
        (err) => {
          self.doing = false;
          self.rate = JSON.parse(JSON.stringify(self.undoRate));
          return new TucToastError(err);
        },
      );
    } else {
      self.rate = JSON.parse(JSON.stringify(self.undoRate));
    }
  };

  init();
}
