import find from 'lodash/find';
import findLast from 'lodash/findLast';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {
  FLAVORS_WITHOUT_RESCUE_MODE,
  GUIDE_URL_RESCUE,
} from './rescue.constants';

export default class PciInstanceRescueController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectsProjectInstanceService,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
  }

  $onInit() {
    this.isLoading = false;
    this.hasRescueMode = PciInstanceRescueController.hasRescueMode(
      this.instance.flavor.type,
    );
    if (this.hasRescueMode) {
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
    } else {
      this.guideUrlRescue =
        GUIDE_URL_RESCUE[this.ovhSubsidiary] || GUIDE_URL_RESCUE.DEFAULT;
    }
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

  static hasRescueMode(flavorType) {
    return !FLAVORS_WITHOUT_RESCUE_MODE.find((value) => value.test(flavorType));
  }
}
