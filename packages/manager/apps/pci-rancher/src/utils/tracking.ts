export const TRACKING_PATH = 'PublicCloud::pci::projects::project::rancher';

export enum TrackingPageView {
  Onboarding = 'onboarding',
  CreateRancher = 'add',
  DetailRancher = 'details',
  DeleteRancherModal = 'delete',
  GenerateAccessModal = 'generate-access',
  EditNameModal = 'edit',
  ListingPage = '',
}

export enum TrackingEvent {
  add = 'add',
  cancel = 'cancel',
  confirm = 'confirm',
  accessUi = 'access-ui',
  generateAccess = 'generate-access',
  generateAccessClose = 'generate-access::close',
  generateAccessCancel = 'generate-access::cancel',
  generateAccessConfirm = 'generate-access::confirm',
  generateAccessAccessUi = 'generate-access::access-ui',
}
