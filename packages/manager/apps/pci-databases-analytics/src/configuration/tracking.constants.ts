import * as database from '@/types/cloud/project/database';

const APP_TRACKING_PREFIX = 'PublicCloud::databases_analytics::databases';
export const PCI_LEVEL2 = '86';
export const TRACKING = {
  onboarding: {
    page: () => `${APP_TRACKING_PREFIX}::databases::onboarding`,
    createDatabaseClick: () =>
      `${APP_TRACKING_PREFIX}::page::button::create_databases`,
    guideClick: (guideName: string) =>
      `${APP_TRACKING_PREFIX}::page::tile-tutorial::go-to-${guideName}`,
  },
  servicesList: {
    page: () => `${APP_TRACKING_PREFIX}::databases::listing`,
    createDatabaseClick: () =>
      `${APP_TRACKING_PREFIX}::page::button::create_databases`,
    guideClick: (guideName: string) =>
      `${APP_TRACKING_PREFIX}::page::tile-tutorial::go-to-${guideName}`,
    serviceLinkClick: (engine: database.EngineEnum, localisation: string) =>
      `${APP_TRACKING_PREFIX}::datagrid::link::details_databases::${engine}_${localisation}`,
    copyIdClick: (engine: database.EngineEnum) =>
      `${APP_TRACKING_PREFIX}::page::datagrid::copy_id::${engine}`,
    renameClick: (engine: database.EngineEnum) =>
      `${APP_TRACKING_PREFIX}::page::datagrid::rename::${engine}`,
    deleteClick: (engine: database.EngineEnum, localisation: string) =>
      `${APP_TRACKING_PREFIX}::page::datagrid::delete_databases::${engine}_${localisation}`,
  },
  renameService: {
    page: (engine: database.EngineEnum) =>
      `${APP_TRACKING_PREFIX}::databases::pop-up::rename::${engine}`,
    cancel: (engine: database.EngineEnum) =>
      `${APP_TRACKING_PREFIX}::pop-up::button::rename::cancel::${engine}`,
    confirm: (engine: database.EngineEnum) =>
      `${APP_TRACKING_PREFIX}::pop-up::button::rename::update::${engine}`,
  },
  deleteService: {
    page: (engine: database.EngineEnum, localisation: string) =>
      `${APP_TRACKING_PREFIX}::databases::pop-up::delete_databases::${engine}_${localisation}`,
    cancel: (engine: database.EngineEnum, localisation: string) =>
      `${APP_TRACKING_PREFIX}::pop-up::button::delete_databases::cancel::${engine}_${localisation}`,
    confirm: (engine: database.EngineEnum, localisation: string) =>
      `${APP_TRACKING_PREFIX}::pop-up::button::delete_databases::confirm::${engine}_${localisation}`,
    success: (engine: database.EngineEnum, localisation: string) =>
      `${APP_TRACKING_PREFIX}::databases::banner-info::delete_databases_success::${engine}_${localisation}`,
    failure: (engine: database.EngineEnum, localisation: string) =>
      `${APP_TRACKING_PREFIX}::databases::banner-error::delete_databases_error::${engine}_${localisation}`,
  },
};
