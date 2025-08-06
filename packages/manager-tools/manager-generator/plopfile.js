/* eslint-disable import/extensions */
import autocompletePrompt from 'inquirer-autocomplete-prompt';
import appGenerator from './app/index.js';

export default (plop) => {
  // add autocomplete prompt
  plop.setPrompt('autocomplete', autocompletePrompt);
  plop.setHelper('uppercase', (name) => name.toUpperCase());
  plop.setHelper('ifEq', (options) =>
    options.hash.arg1 === options.hash.arg2
      ? options.fn(options.data.root)
      : options.inverse(options.data.root),
  );
  plop.setHelper('anyOperationIsGetMethod', (operationList) =>
    operationList.some((operation) => operation.httpMethod === 'get'),
  );
  appGenerator(plop);
};
