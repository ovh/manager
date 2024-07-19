import { SUPPORT_URL } from '../../../new/constants';
import { MESSAGES_CONTAINER_NAME } from '../edit.constant';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiCloudProject,
    $http,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.isLoading = false;
    this.canDeleteProject = true;
    this.$http = $http;
    this.coreConfig = coreConfig;
  }

  cancel() {
    this.trackClick(
      'PublicCloud::pci::projects::project::edit::remove::cancel',
    );
    this.goBack();
  }

  $onInit() {
    this.isLoading = true;
    return this.$http({
      url: '/services',
      params: {
        resourceName: this.projectId,
      },
    }).then(({ data }) => {
      if (data.length) {
        this.checkSavingsPlan(data[0]);
      } else {
        this.isLoading = false;
      }
    });
  }

  checkSavingsPlan(serviceId) {
    this.$http({
      url: `/services/${serviceId}/savingsPlans/subscribed`,
    }).then(({ data }) => {
      this.isLoading = false;
      if (data.length) {
        const activePlan = data.some((p) => p.status === 'ACTIVE');
        if (activePlan) {
          this.canDeleteProject = false;
        }
      }
    });
  }

  getTranslationKey() {
    if (!this.canDeleteProject) {
      return 'pci_projects_project_discovery_edit_savings_plan';
    }
    return `pci_projects_project_${
      this.isDiscoveryProject ? 'discovery_' : ''
    }edit_remove_please_note`;
  }

  getPrimaryButtonLabel() {
    if (!this.canDeleteProject) {
      return 'pci_projects_project_edit_remove_submit_client_service';
    }
    return 'pci_projects_project_edit_remove_submit';
  }

  remove() {
    this.isLoading = true;
    if (!this.canDeleteProject) {
      window.open(
        SUPPORT_URL + this.coreConfig.getUser().ovhSubsidiary,
        '_blank',
        'noopener',
      );
      return this.goBack();
    }

    this.trackClick(
      'PublicCloud::pci::projects::project::edit::remove::confirm',
    );

    const promises = [this.delete()];

    if (
      this.defaultProject &&
      this.defaultProject.projectId === this.serviceName
    ) {
      promises.push(this.unFavProject());
    }

    return Promise.all(promises)
      .then(() => {
        this.trackPage(
          'PublicCloud::pci::projects::project::edit::remove-success',
        );
        return this.CucCloudMessage.success(
          this.$translate.instant('pci_projects_project_edit_remove_success'),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.trackPage(
          'PublicCloud::pci::projects::project::edit::remove-error',
        );
        return this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_edit_remove_error', {
            error: data.message,
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => this.goBack());
  }
}
