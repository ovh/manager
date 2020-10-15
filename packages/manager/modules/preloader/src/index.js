import NProgress from 'nprogress';
import {
  WELCOME_MESSAGES,
  LOADING_MESSAGES,
  SWITCH_PARAMETER,
  MANAGER_BASE_URLS,
} from './constants';
import buildTemplate from './template';

import './style.css';

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

const hasSwitchParameter = (search) =>
  Object.keys(buildQueryParams(search)).includes(SWITCH_PARAMETER);

const isManagerBaseUrl = (url) =>
  MANAGER_BASE_URLS.some((baseUrl) => url.startsWith(baseUrl));

export const attach = (language = 'en') => {
  const template = document.createElement('template');

  let messageSource = WELCOME_MESSAGES;
  if (
    hasSwitchParameter(window.location.search) ||
    isManagerBaseUrl(document.referrer)
  ) {
    messageSource = LOADING_MESSAGES;
  }
  const message = Object.keys(messageSource).includes(language)
    ? messageSource[language]
    : messageSource.en;
  template.innerHTML = buildTemplate(false, message);

  document.body.appendChild(document.importNode(template.content, true));

  NProgress.configure({ parent: '#managerPreloader' });
  NProgress.start();
};

export const detach = () => {
  document.querySelector('#managerPreloader').classList.add('loaded');
  NProgress.done();
};

export default {
  attach,
  detach,
};
