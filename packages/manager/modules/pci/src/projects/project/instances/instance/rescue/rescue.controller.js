import find from 'lodash/find';
import findLast from 'lodash/findLast';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export default class PciInstanceRescueController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PciProjectsProjectInstanceService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.isLoading = false;
    this.ovhDefaultImage = {
      id: '',
      type: 'linux',
      user: 'root',
      name: this.$translate.instant(
        'pci_projects_project_instances_instance_rescue_image_default',
      ),
    };

    if (this.instance.isRescuableWithDefaultImage()) {
      this.selectedImage = this.ovhDefaultImage;
    } else {
      this.selectedImage = findLast(this.images, {
        nameGeneric: get(this.instance.image, 'nameGeneric'),
      });
    }

    this.imageList = [this.ovhDefaultImage, ...this.images];
  }

  getInfosMessage(password = '') {
    const typeKey = this.instance.image.type === 'linux' ? 'linux' : 'windows';
    const pwdKey = isEmpty(password) ? '' : '_with_password';

    return this.$translate.instant(
      `pci_projects_project_instances_instance_rescue_infos_${typeKey}${pwdKey}`,
      {
        instance: this.instance.name,
        user: this.selectedImage.user,
        ip: get(find(this.instance.ipAddresses, { type: 'public' }), 'ip'),
        password,
      },
    );
  }

  rescueInstance() {
    this.isLoading = true;
    return this.PciProjectsProjectInstanceService.rescue(
      this.projectId,
      this.instance,
      this.selectedImage,
    )
      .then(({ adminPassword }) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_rescue_success_message',
            {
              instance: this.instance.name,
            },
          ),
        ).then(() =>
          this.CucCloudMessage.info({
            textHtml: this.getInfosMessage(adminPassword),
          }),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_instances_instance_rescue_error_rescue',
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
