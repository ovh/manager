import appGenerator from './app/index.js';

import autocompletePrompt from 'inquirer-autocomplete-prompt';

export default (plop) => {
  // add autocomplete prompt
  plop.setPrompt('autocomplete', autocompletePrompt);

  appGenerator(plop);
};
