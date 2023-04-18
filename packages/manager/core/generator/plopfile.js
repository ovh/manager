/* eslint-disable import/extensions */
import autocompletePrompt from 'inquirer-autocomplete-prompt';
import appGenerator from './app/index.js';

export default (plop) => {
  // add autocomplete prompt
  plop.setPrompt('autocomplete', autocompletePrompt);

  appGenerator(plop);
};
