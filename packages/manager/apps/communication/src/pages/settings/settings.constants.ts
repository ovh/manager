import { NotificationRouting } from '@/data/types/routing.type';

export enum NotificationRoutingActions {
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
}

export const displayActionMenuItem = (
  routing: NotificationRouting,
  action: NotificationRoutingActions,
): boolean => {
  switch (action) {
    case NotificationRoutingActions.DISABLE:
      return routing.active;
    case NotificationRoutingActions.ENABLE:
      return !routing.active;
    case NotificationRoutingActions.EDIT:
    case NotificationRoutingActions.DELETE:
      return true;
    default:
      return false;
  }
};
