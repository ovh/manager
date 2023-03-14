import controller from './ai-pipeline.controller';
import template from './ai-pipeline.html';

export default {
  bindings: {
    aiItems: '<?',
    onStorageClick: '&?',
    onNotebookClick: '&?',
    onTrainingClick: '&?',
    onDeployClick: '&?',
  },
  controller,
  template,
};
