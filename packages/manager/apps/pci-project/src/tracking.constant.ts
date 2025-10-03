export const LEVEL2 = {
  EU: {
    config: {
      level2: '86',
    },
  },
  CA: {
    config: {
      level2: '86',
    },
  },
  US: {
    config: {
      level2: '86',
    },
  },
};
export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'projects';
export const APP_NAME = 'projects';

export const PROJECTS_TRACKING = {
  LISTING: {
    PAGE_NAME: 'projects-management',
    CTA_CREATE_PROJECT: ['page', 'button', 'create_project'],
    SHOW_PROJECT: ['page', 'button', 'detail_project'],
    DELETE_PROJECT: ['datagrid', 'button', 'delete_project'],
  },
  ONBOARDING: {
    PAGE_NAME: 'projects-management',
    CTA_CREATE_PROJECT: ['page', 'button', 'create_project'],
  },
  DELETE: {
    PAGE_NAME: 'projects-management',
    CTA_CANCEL: ['pop-up', 'button', 'delete_project', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'delete_project', 'confirm'],
    REQUEST_FAIL: 'delete_project_error',
    REQUEST_SUCCESS: 'delete_project_success',
  },
  PROJECT_HOME: {
    PAGE_NAME: 'project-detail',
  },
  CREATING: {
    PAGE_NAME: 'projects-creating',
    CTA_GUIDE: ['page', 'button', 'guide'],
    CTA_OTHER_PROJECTS: ['page', 'button', 'other_projects'],
    PROJECT_DELIVERED: 'project_created',
    PROJECT_DELIVERY_FAILED: 'project_creation_error',
  },
};
