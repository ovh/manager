import template from './template.html';
import navbar from './fragments/navbar';

const developmentConfig = {
  fragments: [navbar],
  template,
};

function fetchConfig(config) {
  return {
    ...config,
    ...developmentConfig,
  };
}

export default fetchConfig;
export { fetchConfig };
