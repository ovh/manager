import template from './certification.html';

export default {
  bindings: {
    certificationName: '<',
    managementInterfaceUrl: '<?',
    status: '<?',
  },
  name: 'ovhManagerPccDashboardOptionsDescriptionsCertification',
  template,
};
