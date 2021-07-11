import controller from './controller';
import template from './template.html';

/**
 * either serviceId or (serviceInfoApiUrl and urlParams) is required
 * ex:
 * <manager-edit-name
 *  service-info-api-url="/dedicated/server/:serviceName/serviceInfos"
 *  url-params="{ serviceName: 'service-name' }">
 * </manager-edit-name>
 * or
 * <manager-edit-name
 *  service-id="service-id">
 * </manager-edit-name>
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
