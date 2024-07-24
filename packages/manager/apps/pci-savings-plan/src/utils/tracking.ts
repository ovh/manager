export const TRACKING_PATH =
  'PublicCloud::pci::projects::project::savings-plan';

export enum TrackingPageView {
  Onboarding = 'onboarding',
  CreateSavingsPlan = 'add',
  DetailSavingsPlan = 'details',
  DeleteSavingsPlanModal = 'delete',
  EditNameModal = 'edit',
  ListingPage = '',
}

export enum TrackingEvent {
  add = 'add',
  cancel = 'cancel',
  confirm = 'confirm',
  accessUi = 'access-ui',
  close = 'close',
}
