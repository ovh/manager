import get from 'lodash/get';
import pick from 'lodash/pick';

import { MESSAGES_CONTAINER_NAME } from './edit.constant';

export default class ProjectEditController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProject, ovhUserPref) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.ovhUserPref = ovhUserPref;

    this.loading = {
      submit: false,
    };
  }

  $onInit() {
    this.checkCartId();

    this.serviceName = this.project.project_id;

    this.messageHandler = this.CucCloudMessage.subscribe(
      MESSAGES_CONTAINER_NAME,
      {
        onMessage: () => this.refreshMessage(),
      },
    );

    this.isDefault = get(this.defaultProject, 'projectId') === this.serviceName;
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  submit() {
    this.loading.submit = true;

    this.trackClick(
      'PublicCloud::pci::projects::project::edit::save-as-default',
    );

    return this.OvhApiCloudProject.v6()
      .put(
        {
          serviceName: this.serviceName,
        },
        pick(this.project, 'description'),
      )
      .$promise.then(() => {
        // isDefault is true, we want to define this project as default project
        if (this.isDefault) {
          this.setDefault(this.serviceName);
        }
        // isDefault is false, if the default project is this one, we should remove the key
        if (this.defaultProject.projectId === this.serviceName) {
          this.unFavProject();
        }
        return null;
      })
      .then(() => {
        this.trackPage('PublicCloud::pci::projects::project::edit-success');
        return this.onUpdate();
      })
      .catch(({ data }) => {
        this.trackPage('PublicCloud::pci::projects::project::edit-error');
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_edit_update_error', {
            error: data?.message || '',
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => {
        this.loading.submit = false;
      });
  }
}
