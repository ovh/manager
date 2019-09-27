import { controller } from './upgrade.controller';

export default {
  layout: 'modal',
  translations: { value: ['.'], format: 'json' },
  url: '/upgradeResource?id&type',
  views: {
    modal: {
      templateUrl: 'dedicatedCloud/resource/upgrade/upgrade.html',
      controller,
    },
  },
};
