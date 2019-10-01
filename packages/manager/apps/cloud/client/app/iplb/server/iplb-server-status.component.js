class IpblServerStatusController {
  constructor(IpblServerStatusService) {
    this.IpblServerStatusService = IpblServerStatusService;
  }

  $onInit() {
    if (!this.server) {
      this.server = {};
    }

    this.iconType = this.IpblServerStatusService.getStatusIcon(this.server);
  }
}

angular.module('managerApp')
  .component('iplbServerStatus', {
    template: `
            <span class="oui-status" data-ng-class="'oui-status_'+$ctrl.iconType" data-ng-bind="$ctrl.iconType"></span>
        `,
    controller: IpblServerStatusController,
    bindings: {
      server: '<',
    },
  });
