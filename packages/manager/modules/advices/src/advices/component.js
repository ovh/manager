import controller from './controller';
import template from './template.html';

/**
 * Makes 2api call to /advices to get advices for a given service type and name.
 * It uses (serviceType, serviceName) or (url, urlParams) and queryParams to construct the URL.
 *
 * Advices returned by the 2api has to be in below format
 * {
 *    adviceGroups: [
 *      {
 *        localizedDescription: '',
 *        advices: [
 *          {
 *            localizedName: string, // this is shown on UI
 *            href: string, // optional, url to a page that need to be opened on clicking a advice
 *            impression: object, // optional, ng-internet impression tracking object,
 *                                // if provided impression and impression click will be tracked
 *            external: boolean, // optional, if true, external icon will be shown
 *          }
 *        ]
 *      }
 *    ]
 * }
 *
 * either href or onAdviceClick must be included in each advices
 *
 * Example:
 * <ovh-advices
 *   url="/cloud/:serviceName/instance/:instanceId"
 *   url-params="{
 *       serviceName: $ctrl.projectId,
 *       instanceId: $ctrl.instance.id,
 *   }"
 * >
 * </ovh-advices>
 * <ovh-advices
 *    service-type="dedicated-server"
 *    advice-name="{{ ::$ctrl.serviceName }}"
 *    on-advice-click="$ctrl.onAdviceClick(advice)">
 * </ovh-advices>
 */
export default {
  bindings: {
    /**
     * Type of the service like instance, dedicated-server, domain-web etc.
     * Use url and urlParams option for nested serviceType
     * @type {string}
     */
    serviceType: '@',

    /**
     * name of the service
     * @type {string}
     */
    serviceName: '@',

    /**
     * map of query params
     * @type {object}
     */
    queryParams: '<?',

    /**
     * event handler to notify click on a advice.
     * @type {Function}
     */
    onAdviceClick: '&?',

    /**
     * url to use to fetch advices ex: /cloud/:serviceName/instance/:instanceId
     * This option should not be used along with serviceType and serviceName.
     * Either serviceType and serviceName or url and urlParams must be used.
     * @type {String}
     */
    url: '@',

    /**
     * Used along with url option. Params to replace in url ex:
     * {
     *   serviceName: $ctrl.projectId,
     *   instanceId: $ctrl.instance.id,
     * }
     * @type {Object}
     */
    urlParams: '<',

    /**
     * Type of advice. Available values are 'retention' and 'upsell-cross-sell'
     * Default value is 'upsell-cross-sell'
     */
    adviceType: '@',

    /**
     * callback handler called on load of advices
     * @type {Function}
     */
    onLoad: '&?',
  },
  controller,
  template,
};
