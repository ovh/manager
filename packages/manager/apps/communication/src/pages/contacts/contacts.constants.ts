import { ContactMean } from '@/data/types/contact-mean.type';

export enum ContactMeanActions {
  EDIT = 'EDIT',
  VALIDATE = 'VALIDATE',
  RESTART_VALIDATION = 'RESTART_VALIDATION',
  DEACTIVATE = 'DEACTIVATE',
  ACTIVATE = 'ACTIVATE',
}

export const displayActionMenuItem = (
  contactMean: ContactMean,
  action: ContactMeanActions,
) => {
  const { status, type } = contactMean;
  switch (action) {
    case ContactMeanActions.EDIT:
      return status === 'VALID';
    case ContactMeanActions.VALIDATE:
      return status === 'TO_VALIDATE';
    case ContactMeanActions.RESTART_VALIDATION:
      return status === 'TO_VALIDATE' && type === 'EMAIL';
    case ContactMeanActions.DEACTIVATE:
      return status === 'VALID';
    case ContactMeanActions.ACTIVATE:
      return status === 'DISABLED';
    default:
      return false;
  }
};
