angular.module('managerApp').filter('showByte', [
  function showByteFilter() {
    const oneEB = 1152921504606846976;
    const onePB = 1125899906842624;
    const oneTB = 1099511627776;
    const oneGB = 1073741824;
    const oneMB = 1048576;
    const oneKB = 1024;

    return function showByte(bytes) {
      if (bytes >= oneEB) {
        return `${(bytes / oneEB).toFixed(2)}EB`;
      }
      if (bytes >= onePB) {
        return `${(bytes / onePB).toFixed(2)}PB`;
      }
      if (bytes >= oneTB) {
        return `${(bytes / oneTB).toFixed(2)}TB`;
      }
      if (bytes >= oneGB) {
        return `${(bytes / oneGB).toFixed(2)}GB`;
      }
      if (bytes >= oneMB) {
        return `${(bytes / oneMB).toFixed(2)}MB`;
      }
      if (bytes >= oneKB) {
        return `${(bytes / oneKB).toFixed(2)}KB`;
      }
      return `${bytes}B`;
    };
  },
]);
