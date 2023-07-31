/* eslint-disable import/extensions */
import autocompletePrompt from 'inquirer-autocomplete-prompt';
import appGenerator from './component/index.js';

export default (plop) => {
  // add autocomplete prompt
  plop.setPrompt('autocomplete', autocompletePrompt);
  plop.setHelper('uppercase', (name) => name.toUpperCase());
  appGenerator(plop);
};
