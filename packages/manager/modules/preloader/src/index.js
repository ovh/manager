import {
  WELCOME_MESSAGES,
  LOADING_MESSAGES,
  SWITCH_PARAMETER,
} from './constants';
import buildTemplate from './template';

const buildQueryParams = (search) => {
  const queryParamsString =
    search.indexOf('?') === 0 ? search.slice(1) : search;

  return queryParamsString.split('&').reduce((params, pair) => {
    const [name, value] = pair.split('=');
    return {
      ...params,
      [name]: decodeURIComponent(value),
    };
  }, {});
};

export const attach = () => {
  const queryParams = buildQueryParams(window.location.search);
  const template = document.createElement('template');

  if (!Object.keys(queryParams).includes(SWITCH_PARAMETER)) {
    template.innerHTML = buildTemplate(false, WELCOME_MESSAGES);
  } else {
    template.innerHTML = buildTemplate(false, LOADING_MESSAGES);
  }

  document.body.appendChild(document.importNode(template.content, true));
};

export const detach = () => {
  document.querySelector('#managerPreloader').classList.add('loaded');
};

export default {
  attach,
  detach,
};
