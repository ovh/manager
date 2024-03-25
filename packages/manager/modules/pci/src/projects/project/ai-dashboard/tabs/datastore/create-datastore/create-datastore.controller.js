import {
  DATASTORE_TYPE,
  GIT_AUTHENTIFICATION_TYPE,
} from './create-datastore.constants';
import { AI_DATASTORE_OWNER } from '../../../ai-dashboard.constants';

export default class AIDashboadCreateDatastoreCtrl {
  /* @ngInject */
  constructor($translate, atInternet, AiDashboardService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.AiDashboardService = AiDashboardService;
  }

  $onInit() {
    this.datastoreType = DATASTORE_TYPE;
    [this.currentRegion] = this.regions;
    [this.currentType] = this.datastoreType;
    this.isS3selected = true;
  }

  onDatastoreTypeChange() {
    this.isS3selected = !this.isS3selected;
    if (!this.isS3selected) {
      this.gitAuthentType = GIT_AUTHENTIFICATION_TYPE;
      this.sshSelected = true;
      [this.currentGitAuthent] = this.gitAuthentType;
    }
  }

  createDatastore() {
    this.processing = true;
    const datastore = {
      alias: this.model.alias,
      endpoint: this.model.endpoint,
      owner: AI_DATASTORE_OWNER,
      type: this.currentType.id,
      credentials: this.model.credentials,
    };
    return this.AiDashboardService.createDatastore(
      this.projectId,
      this.currentRegion.id,
      datastore,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_ai_dashboard_create_datastore_success_msg',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_ai_dashboard_create_datastore_error_msg',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        ),
      );
  }

  closeModal() {
    this.goBack();
  }
}
