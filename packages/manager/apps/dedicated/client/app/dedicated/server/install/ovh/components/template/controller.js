import filter from 'lodash/filter';
import snakeCase from 'lodash/snakeCase';

import { AVAILABLE_TEMPLATE_CATEGORIES } from './constants';

export default class DedicatedServerInstallOvhTemplateCtrl {
  /* @ngInject */
  constructor(dedicatedServerInstallOvh) {
    this.dedicatedServerInstallOvh = dedicatedServerInstallOvh;

    this.snakeCase = snakeCase;

    this.lists = {
      availableTemplateCategories: null,
      availableTemplateFamilies: new Map(),
    };
  }

  get template() {
    return this.model.template;
  }

  /*= =============================
  =            Events            =
  ============================== */

  onTemplateCategoryChange() {
    this.getAvailableTemplateFamiliesList();
  }

  /**
   * @TODO: manage error
   */
  onTemplateChange() {
    this.template.language = this.template.template.defaultLanguage;

    this.installLoaders.global = true;

    this.dedicatedServerInstallOvh
      .createInstallationTemplate({
        baseTemplateName: this.template.template.templateName,
        defaultLanguage: this.template.language,
      })
      .then((installationTemplate) => {
        this.installLoaders.partition = true;
        this.model.setPartitionTemplate(installationTemplate);

        return this.dedicatedServerInstallOvh
          .getInstallationTemplateDefaultPartitionScheme(installationTemplate)
          .then(() => {
            return this.dedicatedServerInstallOvh
              .getInstallationTemplatePartitions(
                installationTemplate.defaultPartitionScheme,
              )
              .then(() => {
                console.log('oui ?');
                this.model.setRemainingSizeToEmptyPartition();
                this.model.refreshRemainingSize();
              });
          });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        this.installLoaders.global = false;
        this.installLoaders.partition = false;
      });
  }

  /*= ====  End of Events  ====== */

  /*= =====================================
  =            Initialization            =
  ====================================== */

  getAvailableTemplateFamiliesList() {
    this.lists.availableTemplateFamilies.clear();

    // first filter compatible templates with selected category of template
    const templatesOfCategory = filter(
      this.server.compatibleInstallationTemplates,
      {
        category: this.template.category,
      },
    );

    // then group templates by families
    this.templatesFamilies.forEach((family) => {
      const templatesOfFamily = filter(templatesOfCategory, { family });

      if (templatesOfFamily.length) {
        this.lists.availableTemplateFamilies.set(family, templatesOfFamily);
      }
    });

    return this.lists.availableTemplateFamilies;
  }

  $onInit() {
    this.lists.availableTemplateCategories = AVAILABLE_TEMPLATE_CATEGORIES;
    [this.template.category] = this.lists.availableTemplateCategories;

    this.getAvailableTemplateFamiliesList();

    [this.template.diskGroup] = this.server.hardware.specifications.diskGroups;
  }

  /*= ====  End of Initialization  ====== */
}
