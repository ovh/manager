angular.module('managerApp')
  .filter('additionalDiskOptions', () => (additionalDiskOptionParam) => {
    let additionalDiskOption = additionalDiskOptionParam;
    additionalDiskOption = additionalDiskOption.replace(/[a-zA-Z]*/, '');
    return additionalDiskOption;
  });
