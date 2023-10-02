/* eslint-disable import/extensions */
import autocompletePrompt from 'inquirer-autocomplete-prompt';
import appGenerator from './app/index.js';

export default (plop) => {
  // add autocomplete prompt
  plop.setPrompt('autocomplete', autocompletePrompt);
  plop.setHelper('uppercase', (name) => name.toUpperCase());
  plop.setHelper('ifEqListingEndpoint', (options) =>
    options.data.root.listingEndpoint === options.hash.value
      ? options.fn(options.hash)
      : options.inverse(this),
  );
  plop.setHelper('anyOperationIsGetMethod', (operationList) =>
    operationList.some((operation) => operation.httpMethod === 'get'),
  );
  appGenerator(plop);
};
