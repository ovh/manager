import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    user: '<',
    dbCategories: '<',
    preselectDbCategory: '<',
    onDbCategoryClick: '&',
    onDbCategoryEngineClick: '&',
  },
  controller,
  template,
};

export default component;
