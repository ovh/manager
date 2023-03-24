import { ROUTES } from '@iam/routes';

export default class CreateResourceGroupController {
  /* @ngInject */
  constructor() {
    this.resourceGroup = { name: '' };
  }

  /**
   * go to resourceGroup
   * @returns {Promise}
   */
  goToResourceGroup() {
    this.goTo({
      name: ROUTES.RESOURCE_GROUP,
    });
  }

  submit() {
    this.alert.error('submit not implemented');
  }
}
