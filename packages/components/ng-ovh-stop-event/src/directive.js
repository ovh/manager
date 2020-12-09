export default function () {
  return {
    restrict: 'A',
    link(scope, element, attr) {
      element.bind(attr.ovhStopEvent, (e) => {
        if (
          !attr.ovhStopEventDisabled ||
          attr.ovhStopEventDisabled !== 'true'
        ) {
          e.stopPropagation();
        }
      });
    },
  };
}
