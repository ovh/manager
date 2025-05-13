import template from './cronSimpleSummary.html';

export default () => ({
  restrict: 'E',
  replace: true,
  scope: {
    crontabObject: '=',
  },
  template,
  controller: 'wucCronSimpleSummaryCtrl',
});
