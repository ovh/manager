import controller from './proxy-form.controller';
import template from './proxy-form.template.html';
import './proxy-form.styles.scss';

export default {
  bindings: {
    collapsible: '<',
    dense: '<',
    frozen: '<',
    /**
     * @type {{
     *   mode: string
     *   values: {
     *     minSyncPeriod?: string
     *     syncPeriod?: string
     *     scheduler?: string
     *     tcpFinTimeout?: string
     *     tcpTimeout?: string
     *     udpTimeout?: string
     *   }
     * } | null}
     */
    ngModel: '<',
  },
  require: {
    ngModelCtrl: '^ngModel',
  },
  controller,
  template,
};
