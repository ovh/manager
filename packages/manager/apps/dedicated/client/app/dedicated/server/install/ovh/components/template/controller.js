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

  /*= =============================
  =            Events            =
  ============================== */

  onTemplateCategoryChange() {
    this.initAvailableTemplateFamiliesList();
  }

  /*= ====  End of Events  ====== */

  /*= =====================================
  =            Initialization            =
  ====================================== */

  initAvailableTemplateFamiliesList() {
    this.lists.availableTemplateFamilies.clear();

    // first filter compatible templates with selected category of template
    const templatesOfCategory = filter(this.compatibleTemplates, {
      category: this.templateModel.category,
    });

    // then group templates by families
    this.templatesFamilies.forEach((family) => {
      const templatesOfFamily = filter(templatesOfCategory, { family });

      if (templatesOfFamily.length) {
        this.lists.availableTemplateFamilies.set(family, templatesOfFamily);
      }
    });
  }

  initLists() {
    this.lists.availableTemplateCategories = AVAILABLE_TEMPLATE_CATEGORIES;

    this.initAvailableTemplateFamiliesList();
  }

  $onInit() {
    [this.templateModel.category] = AVAILABLE_TEMPLATE_CATEGORIES;
    [this.templateModel.diskGroup] = this.hardwareSpecifications.diskGroups;

    this.initLists();
  }

  /*= ====  End of Initialization  ====== */
}
