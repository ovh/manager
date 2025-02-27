import { AbstractCursorDatagridController } from '@ovh-ux/manager-ng-apiv2-helper';
import { TAG } from '../iam.constants';

export default class ApplicationsController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor(IAMService) {
    super();
    this.IAMService = IAMService;
  }

  /**
   * Go to resourceGroup deletion
   * @param {string} id The application id
   * @returns {Promise}
   */
  deleteApplication(id) {
    this.trackClick(TAG.APPLICATIONS__DELETE);
    this.goTo({
      name: 'iam.dashboard.applications.delete',
      params: { application: id },
    });
  }
}
