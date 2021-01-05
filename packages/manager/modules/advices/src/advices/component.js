import controller from './controller';
import template from './template.html';

/**
 * Makes 2api call to /adives to get advices for a given service type and name.
 * It used serviceType, serviceName and queryParams to construct the URl.
 *
 * serviceType: type of service, refer 2api /advices documentation for list of service types supported.
 *
 * ServiceName: name of service
 *
 * queryParams: map of query params that need to pass to /advices api
 *
 * onAdviceClick: event handler to notify click on a advice
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
 *            tag: string, // optional, ng-internet tag, if provided click will be tracked (of type action)
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
 *    service-type="dedicated-server"
 *    advice-name="{{ ::$ctrl.serviceName }}"
 *    on-advice-click="$ctrl.onAdviceClick(advice)">
 * </ovh-advices>
 *
 */
export default {
  bindings: {
    /**
     * service type
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
     * @type {string}
     */
    queryParams: '<?',

    /**
     * event handler to notify click on a advice.
     * @type {Function}
     */
    onAdviceClick: '&?',
  },
  controller,
  template,
};
