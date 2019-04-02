import pick from 'lodash/pick';

import { DEFAULT_PROJECT_KEY, MESSAGES_CONTAINER_NAME } from './edit.constant';

export default class ProjectEditController {
  /* @ngInject */
  constructor($stateParams, $translate, CucCloudMessage, ovhUserPref, OvhApiCloudProject) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhUserPref = ovhUserPref;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.serviceName = this.$stateParams.projectId;

    this.loading = {
      init: false,
      submit: false,
    };

    this.$ngInit();
  }

  $ngInit() {
    this.loading.init = true;
    this.messageHandler = this.CucCloudMessage.subscribe(MESSAGES_CONTAINER_NAME, {
      onMessage: () => this.refreshMessage(),
    });

    return this.OvhApiCloudProject
      .v6()
      .get({
        serviceName: this.serviceName,
      })
      .$promise
      .then((project) => {
        this.project = project;
      })
      .then(() => this.ovhUserPref.getValue(DEFAULT_PROJECT_KEY))
      .then((defaultProject) => {
        this.defaultProject = defaultProject;
        this.isDefault = this.serviceName === defaultProject.projectId;
      })
      .catch((err) => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  submit() {
    this.loading.submit = true;

    return this.OvhApiCloudProject
      .v6()
      .put(
        {
          serviceName: this.serviceName,
        },
        pick(this.project, 'description'),
      )
      .$promise
      .then(() => {
        // isDefault is true, we want to define this project as default project
        if (this.isDefault) {
          return this.ovhUserPref.create(
            DEFAULT_PROJECT_KEY,
            { projectId: this.serviceName },
          );
        }
        // isDefault is false, if the default project is this one, we should remove the key
        if (this.defaultProject.projectId === this.serviceName) {
          return this.ovhUserPref.remove(DEFAULT_PROJECT_KEY);
        }
        return null;
      })
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('pci_projects_project_edit_update_success'),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_edit_update_error', { error: data.message }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => {
        this.loading.submit = false;
      });
  }
}
