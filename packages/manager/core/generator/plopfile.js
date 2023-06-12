/* eslint-disable import/extensions */
import autocompletePrompt from 'inquirer-autocomplete-prompt';
import appGenerator from './app/index.js';

export default (plop) => {
  // add autocomplete prompt
  plop.setPrompt('autocomplete', autocompletePrompt);
  plop.setHelper('uppercase', (name) => name.toUpperCase());
  plop.setHelper('anyOperationIsGetMethod', (operationList) =>
    operationList.some((operation) => operation.httpMethod === 'get'),
  );
  appGenerator(plop);
};
