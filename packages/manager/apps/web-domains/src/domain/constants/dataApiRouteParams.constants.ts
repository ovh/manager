import { DomainStateEnum } from '@/domain/enum/domainState.enum';

export const FILTER_KEY_TO_API_PARAM: Record<string, string> = {
  'contactOwner.id': 'contactOwner',
  'contactAdmin.id': 'contactAdministrator',
  'contactTech.id': 'contactTechnical',
  'contactBilling.id': 'contactBilling',
  state: 'mainState',
  suspensionState: 'suspensionState',
};
export const MAIN_STATE_ALL_VALUES = Object.values(DomainStateEnum);
export const CURSOR_EXPIRED_ERROR_STATUS = 500;
