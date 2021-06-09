import controller from './controller';
import template from './template.html';

/**
 * either serviceId or (serviceInfoApiUrl and urlParams) is required
 * ex:
 * <server-edit-name
 *  service-info-api-url="/dedicated/server/:serviceName/serviceInfos"
 *  url-params="{ serviceName: 'service-name' }">
 * </server-edit-name>
 * or
 * <server-edit-name
 *  service-id="service-id">
 * </server-edit-name>
 *
 * */
export default {
  bindings: {
    name: '@',
    serviceId: '@?',
    serviceInfoApiUrl: '@?',
    urlParams: '<?',
    loading: '<?',
    onSuccess: '&?',
    onCancel: '&?',
    onError: '&?',
  },
  controller,
  template,
};
