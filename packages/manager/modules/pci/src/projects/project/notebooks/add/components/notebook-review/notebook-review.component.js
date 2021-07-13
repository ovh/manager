import controller from './notebook-review.controller';
import template from './notebook-review.html';

export default {
  bindings: {
    projectId: '<',
    convertNotebookModel: '<',
    displayNotebookReview: '<',
    notebookModel: '<',
    prices: '<',
  },
  controller,
  template,
};
