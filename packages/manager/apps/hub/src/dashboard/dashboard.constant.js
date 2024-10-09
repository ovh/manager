export const SIRET_TRACKING_PREFIX = 'hub::add-siret-banner';

export const SIRET_HIT_PREFIX = `${SIRET_TRACKING_PREFIX}::goto-edit-profile`;

export const TRACKING_PREFIX_EDIT = 'edit-profil-confirm-banner';

export const TRACKING_PREFIX_POPUP = 'hub::add-siret-popup';

export const KYC_TRACKING_PREFIX = 'alert::kyc-india';

export const KYC_HIT_PREFIX = `${KYC_TRACKING_PREFIX}::verify-identity`;

export const KYC_STATUS = {
  OPEN: 'open',
  REQUIRED: 'required',
};

export default {
  SIRET_TRACKING_PREFIX,
  SIRET_HIT_PREFIX,
  TRACKING_PREFIX_POPUP,
  TRACKING_PREFIX_EDIT,
  KYC_TRACKING_PREFIX,
  KYC_HIT_PREFIX,
};
