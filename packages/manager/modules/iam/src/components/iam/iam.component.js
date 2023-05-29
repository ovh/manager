import { ALERT_ID } from '../../iam.constants';

import './iam.styles.scss';

export default {
  template: `
    <div class="iam">
      <div data-ovh-alert="${ALERT_ID}" class="mt-3"></div>
      <div data-ui-view></div>
    </div>
  `,
};
