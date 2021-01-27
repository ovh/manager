import template from './cronEdit.html';

export default () => ({
  restrict: 'E',
  replace: true,
  scope: {
    crontabObject: '=',
  },
  template,
  controller: 'wucCronEditorCtrl',
});
