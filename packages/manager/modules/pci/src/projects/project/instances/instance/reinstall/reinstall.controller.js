import get from 'lodash/get';
import { EDIT_PAGE_SECTIONS } from '../instance.constants';

export default class PciInstanceReinstallController {
  /* @ngInject */
  constructor(
    $anchorScroll,
    $location,
    $translate,
    CucCloudMessage,
    PciProjectsProjectInstanceService,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.isLoading = false;
    this.reinstallSuccessMessage =
      this.reinstallSuccessMessage ||
      'pci_projects_project_instances_instance_reinstall_success_message';
  }

  reinstallInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.reinstall(
      this.projectId,
      this.instance,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(this.reinstallSuccessMessage, {
            instance: this.instance.name,
          }),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_reinstall_error_reinstall',
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

  /**
   * This function is used in case where customer image is deprecated
   * To allow him to choose and install new image
   * @returns {Promise}
   */
  goToEditAnInstance() {
    return this.editInstance(this.instance).then(() => {
      this.$location.hash(EDIT_PAGE_SECTIONS.IMAGES);
      this.$anchorScroll();
    });
  }
}
