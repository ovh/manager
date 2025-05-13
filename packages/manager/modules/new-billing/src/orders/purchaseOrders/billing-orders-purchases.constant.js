export const PURCHASE_ORDER = 'Purchase order';

export const ENUM_PURCHASES_STATUS = ['actif', 'inactif', 'desactivate'];

export const TYPE_PURCHASE = {
  REFERENCE_ORDER: 'REFERENCE_ORDER',
  PURCHASE_ORDER: 'PURCHASE_ORDER',
};

export const TYPE_PURCHASE_FOR_TRACKING = {
  REFERENCE_ORDER: 'internal-ref',
  PURCHASE_ORDER: 'po',
};

export const PAGE_SIZE = 10;

export const DATE_FORMAT_MOMENT = 'YYYY-MM-DD';

export default {
  ENUM_PURCHASES_STATUS,
  TYPE_PURCHASE_FOR_TRACKING,
  PAGE_SIZE,
  DATE_FORMAT_MOMENT,
};
