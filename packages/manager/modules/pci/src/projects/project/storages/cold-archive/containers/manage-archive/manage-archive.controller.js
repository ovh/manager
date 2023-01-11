import { MANAGE_ARCHIVE_DOC_LINK } from '../../cold-archives.constants';

export default class ColdArchiveContainersManageArchiveController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.isLoading = false;
  }

  getDocumentationUrl() {
    return MANAGE_ARCHIVE_DOC_LINK[
      this.coreConfig.getUserLanguage().toUpperCase()
    ];
  }

  cancel() {
    return this.goBack();
  }
}
