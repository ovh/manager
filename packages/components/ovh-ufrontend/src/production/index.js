import template from './template.html';
import navbar from './fragments/navbar';

const prodConfig = {
  fragments: [navbar],
  template,
};

function fetchConfig(config) {
  return {
    ...config,
    ...prodConfig,
  };
}

export default fetchConfig;
export { fetchConfig };
