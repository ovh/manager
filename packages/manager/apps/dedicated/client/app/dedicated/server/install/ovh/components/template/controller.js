import filter from 'lodash/filter';
import snakeCase from 'lodash/snakeCase';

import { AVAILABLE_TEMPLATE_CATEGORIES } from './constants';

export default class DedicatedServerInstallOvhTemplateCtrl {
  constructor() {
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

  onTemplateChange() {
    this.template.language = this.template.template.defaultLanguage;
  }

  /*= ====  End of Events  ====== */

  /*= =====================================
  =            Initialization            =
  ====================================== */

  getAvailableTemplateFamiliesList() {
    this.lists.availableTemplateFamilies.clear();

    // first filter compatible templates with selected category of template
    const templatesOfCategory = filter(this.compatibleTemplates, {
      category: this.template.category,
    });

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
