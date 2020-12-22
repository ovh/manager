import controller from './controller';
import template from './template.html';

/**
 * advices: can be array or promise which can resolve to array.
 * In case of promise, component will not show advices untill promise is resolved.
 *
 * onAdviceClick: event handler to notify click on a advice
 *
 * advices must contain array of advice object.
 * advice object can have below properties
 * {
 *   localizedName: string, // this is shown on UI
 *   href: string, // optional, url to a page that need to be opened on clicking a advice
 *   tag: string, // optional, ng-internet tag, if provided click will be tracked (of type action)
 *   external: boolean, // optional, if true, external icon will be shown
 * }
 *
 * either href or onAdviceClick must be provided
 *
 * Example:
 * <ovh-advices
 *    description="{{ ::'server_advices_dedicated_description' | translate }}"
 *    advices="$ctrl.advices"
 *    on-advice-click="$ctrl.onAdviceClick(advice)">
 * </ovh-advices>
 *
 * advices array
 * [{
 *    localizedName: this.$translate.instant('server_advices_dedicated_advice1'),
 *    href: this.orderPublicBandwidthLink,
 *    tag: 'cross_sell::dedicated::bare_metal_advanced_without_guaranteed_bw::public_bandwidth_1gbps_unmetered_and_guaranteed',
 * }]
 */
export default {
  bindings: {
    /**
     * advice description, shown on advices tile
     * @type {string}
     */
    description: '@',
    /**
     * can be array of advices or promise which can resolve to array of advices
     * @type {Array} or
     * @type {Promise}
     */
    advices: '<',
    /**
     * event handler to notify click on a advice.
     * @type {Function}
     */
    onAdviceClick: '&?',
  },
  controller,
  template,
};
