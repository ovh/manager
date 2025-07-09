export const APP_TRACKING_PREFIX = 'PublicCloud::ai_machine_learning';
export const NOTEBOOK_TRACKING = '::notebooks';
export const PCI_LEVEL2 = '86';
export const DISCOVERY_PLANCODE = 'project.discovery';

export const TRACKING = {
  notebooks: {
    onboarding: {
      createNotebooksClick: () =>
        `${APP_TRACKING_PREFIX}${NOTEBOOK_TRACKING}::notebooks::page::button::create_notebooks`,
    },
    listing: {
      createNotebooksClick: () =>
        `${APP_TRACKING_PREFIX}${NOTEBOOK_TRACKING}::page::button::create_notebooks`,
      stopNotebooksDataGridClick: () =>
        `${APP_TRACKING_PREFIX}${NOTEBOOK_TRACKING}::datagrid::button::stop_notebooks`,
    },
    // keep same structure
  },
};
