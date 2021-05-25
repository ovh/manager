import controller from './controller';
import template from './template.html';

/**
 * either serviceId or (serviceInfoApiUrl and urlParams) is required
 * ex:
 * <bm-server-edit-name
 *  service-info-api-url="/dedicated/server/:serviceName/serviceInfos"
 *  url-params="{ serviceName: 'service-name' }">
 * </bm-server-edit-name>
 * or
 * <bm-server-edit-name
 *  service-id="service-id">
 * </bm-server-edit-name>
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
