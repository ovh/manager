import NProgress from 'nprogress';
import {
  WELCOME_MESSAGES,
  LOADING_MESSAGES,
  SWITCH_PARAMETER,
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

export const attach = (language = 'en') => {
  const queryParams = buildQueryParams(window.location.search);
  const template = document.createElement('template');

  let messageSource = LOADING_MESSAGES;
  if (!Object.keys(queryParams).includes(SWITCH_PARAMETER)) {
    messageSource = WELCOME_MESSAGES;
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
