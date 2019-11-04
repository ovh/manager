import {
  HEADER_LOCALE,
} from './translate.constants';

export default /* @ngInject */ TranslateService => ({
  request: config => ({
    ...config,
    headers: {
      ...config.headers,
      [HEADER_LOCALE]: TranslateService.getUserLocale(),
    },
  }),
});
