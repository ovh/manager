angular.module('managerApp').filter('additionalDiskOptions', () => function (additionalDiskOptionParam) {
  let additionalDiskOption = additionalDiskOptionParam;
  additionalDiskOption = additionalDiskOption.replace(/[a-zA-Z]*/, '');
  return additionalDiskOption;
});
