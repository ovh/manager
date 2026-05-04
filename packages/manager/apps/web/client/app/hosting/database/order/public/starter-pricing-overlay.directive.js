const HOST_ACTIVE_CLASS = 'starter-pricing-overlay-active';
const STYLE_TAG_ID = 'starter-pricing-overlay-style';

const ensureStyleTag = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_TAG_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_TAG_ID;
  style.textContent = `
    .${HOST_ACTIVE_CLASS} oui-select-picker.align-self-baseline {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
};

/* @ngInject */
export default function starterPricingOverlay($compile, $timeout) {
  return {
    restrict: 'A',
    scope: false,
    link(scope, element, attrs) {
      ensureStyleTag();

      let injectedNode = null;
      let pollHandle = null;

      const cancelPoll = () => {
        if (pollHandle) {
          $timeout.cancel(pollHandle);
          pollHandle = null;
        }
      };

      const removeOverlay = () => {
        cancelPoll();
        element[0].classList.remove(HOST_ACTIVE_CLASS);
        if (injectedNode) {
          injectedNode.remove();
          injectedNode = null;
        }
      };

      const findPricingStepBody = () => {
        const sharedPicker = element[0].querySelector(
          'oui-select-picker.align-self-baseline',
        );
        if (!sharedPicker) return null;
        // Walk up to the picker's row container (`<div class="d-flex flex-row">`).
        let node = sharedPicker.parentElement;
        while (node && !node.classList.contains('d-flex')) {
          node = node.parentElement;
          if (node === element[0]) return null;
        }
        return node || sharedPicker.parentElement;
      };

      const tryInject = () => {
        pollHandle = null;
        const summary = scope.$eval(attrs.starterPricingOverlay);
        if (!summary) {
          removeOverlay();
          return;
        }

        const componentCtrl = element.controller('ovhManagerProductOffers');
        if (!componentCtrl?.workflow?.pricings?.length) {
          // Pricings not loaded yet — wait for getPricings() to populate
          pollHandle = $timeout(tryInject, 100);
          return;
        }

        // Auto-select the unique pricing so data-valid="workflow.pricing"
        // on the shared step is satisfied (Suivant button is enabled).
        if (!componentCtrl.workflow.pricing) {
          [componentCtrl.workflow.pricing] = componentCtrl.workflow.pricings;
        }

        // Toggle the host class — CSS rule hides any rendered picker,
        // even if Angular re-renders the picker DOM later.
        element[0].classList.add(HOST_ACTIVE_CLASS);

        if (injectedNode && injectedNode.isConnected) return;

        const stepBody = findPricingStepBody();
        if (!stepBody) {
          pollHandle = $timeout(tryInject, 100);
          return;
        }

        const tpl = `
          <div class="hosting-db-starter-pricing-overlay">
            <div
              class="d-flex flex-row mb-2"
              data-ng-repeat="row in $ctrl.getStarterPricingSummary().rows"
            >
              <strong class="mr-2" data-ng-bind="row.label"></strong>
              <span data-ng-bind="row.value"></span>
            </div>
            <p
              class="mb-2 mt-3"
              data-ng-repeat="note in $ctrl.getStarterPricingSummary().notes"
              data-ng-bind="note"
            ></p>
          </div>`;
        const compiled = $compile(tpl)(scope);
        stepBody.parentNode.insertBefore(compiled[0], stepBody);
        injectedNode = compiled[0];
      };

      scope.$watch(
        () => !!scope.$eval(attrs.starterPricingOverlay),
        (hasSummary) => {
          if (hasSummary) {
            cancelPoll();
            pollHandle = $timeout(tryInject);
          } else {
            removeOverlay();
          }
        },
      );

      scope.$on('$destroy', removeOverlay);
    },
  };
}
