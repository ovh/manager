import get from 'lodash/get';
import { VIRTUAL_TYPE } from './interfaces.constants';

export default class {
  /* @ngInject */
  constructor($translate, Alerter, DedicatedServerInterfacesService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.InterfaceService = DedicatedServerInterfacesService;
  }

  $onInit() {
    this.VIRTUAL_TYPE = VIRTUAL_TYPE;
    this.loading = true;
    this.taskPolling.promise
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant('dedicated_server_interfaces_task_error', {
            errorMessage: get(error, 'comment'),
          }),
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
