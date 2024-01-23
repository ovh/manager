import get from 'lodash/get';
import { STOP_INSTANCE_INFO_LINK } from './constants';

export default class PciInstanceStopController {
  /* @ngInject */
  constructor(
    $translate,
    OvhApiCloudProjectInstance,
    PciProjectsProjectInstanceService,
    Poller,
  ) {
    this.$translate = $translate;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.Poller = Poller;
    this.docLink = STOP_INSTANCE_INFO_LINK;
  }

  $onInit() {
    this.isLoading = false;
  }

  waitInstanceStop() {
    const endPointUrl = `/cloud/project/${this.projectId}/instance/${this.instance.id}`;
    return this.Poller.poll(endPointUrl, null, {
      interval: 1000,
      successRule(instance) {
        return instance.status === 'SHUTOFF';
      },
      namespace: 'cloud.project.instance.stop',
      notifyOnError: false,
    });
  }

  stopInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.stop(
      this.projectId,
      this.instance,
    )
      .then(() => this.waitInstanceStop())
      .then(() => this.OvhApiCloudProjectInstance.v6().resetQueryCache())
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_stop_success_message',
            {
              instance: this.instance.name,
            },
          ),
        );
      })
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_stop_error_message',
            {
              message: get(err, 'data.message', null),
              instance: this.instance.name,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
