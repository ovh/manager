import { COLD_ARCHIVE_STATES as STATES } from '../cold-archives.constants';

export const COLD_ARCHIVE_STATES = STATES;

export const COLD_ARCHIVE_CONTAINER_STATUS = {
  ARCHIVED: 'archived',
  ARCHIVING: 'archiving',
  DELETING: 'deleting',
  FLUSHED: 'flushed',
  NONE: 'none',
  RESTORED: 'restored',
  RESTORING: 'restoring',
};

export const CONTAINER_STATUS_OPTIONS = {
  none: {
    actions: ['archive', 'delete'],
    componentClass: 'oui-badge oui-badge_sold-out',
  },
  archiving: {
    actions: [],
    componentClass: 'oui-badge oui-badge_info',
  },
  archived: {
    actions: ['restore', 'delete'],
    componentClass: 'oui-badge oui-badge_success',
  },
  restoring: {
    actions: [],
    componentClass: 'oui-badge oui-badge_info',
  },
  restored: {
    actions: ['delete'],
    componentClass: 'oui-badge oui-badge_success',
  },
  deleting: {
    actions: [],
    componentClass: 'oui-badge oui-badge_warning',
  },
  flushed: {
    actions: [],
    componentClass: 'oui-badge oui-badge_error',
  },
};

export default {
  CONTAINER_STATUS_OPTIONS,
  COLD_ARCHIVE_STATES,
};
