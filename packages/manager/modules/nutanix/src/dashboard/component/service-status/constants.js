import { SERVICE_STATES } from '../../../constants';

export const SERVICE_BADGE_STATES = {
  [SERVICE_STATES.ACTIVE]: 'oui-badge_success',
  [SERVICE_STATES.SUSPENDED]: 'oui-badge_warning',
  [SERVICE_STATES.TO_SUSPEND]: 'oui-badge_info',
  [SERVICE_STATES.UNKNOWN]: 'oui-badge_success',
};

export default {
  SERVICE_BADGE_STATES,
};
