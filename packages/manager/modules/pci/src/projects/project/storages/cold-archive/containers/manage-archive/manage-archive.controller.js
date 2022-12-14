import { MANAGE_ARCHIVE_DOC_LINK } from '../../cold-archives.constants';

export default class ColdArchiveContainersManageArchiveController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.trackPage('containers::container::manage');
    this.isLoading = false;
  }

  getDocumentationUrl() {
    return MANAGE_ARCHIVE_DOC_LINK[
      this.coreConfig.getUserLanguage().toUpperCase()
    ];
  }

  cancel() {
    this.trackClick('containers::container::manage::cancel');
    return this.goBack();
  }
}
