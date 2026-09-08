import controller from './controller';
import template from './template.html';

export default {
  template,
  controller,
  bindings: {
    // The { answered, isDecommissioned } object resolved once on the root
    // dbaas-logs state.
    legacyAccess: '<',
    trackClick: '<',
    // Optional: when a surface owns an enable-IAM action, the notice link
    // triggers it instead of navigating to the roles listing.
    onEnableIam: '&?',
    // Optional: suppress the enable-IAM link on a surface where the roles
    // listing is not a valid destination (a service awaiting configuration).
    hideEnableIam: '<?',
  },
};
