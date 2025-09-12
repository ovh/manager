import controller from './resiliate-modal.controller';
import template from './resiliate-modal.html';

export default {
  bindings: {
    capabilities: '<',
    goBack: '<',
    onSuccess: '<',
    onError: '<',
    service: '<',
    serviceTypeLabel: '<', // Should be an `@` but we have an issue with ui-router-layout
  },
  transclude: {
    'additional-description': '?modalAdditionalDescription',
    'option-fallback': '?modalOptionFallback',
    message: '?modalMessage',
  },
  controller,
  name: 'ovhManagerBillingResiliateModal',
  template,
};
