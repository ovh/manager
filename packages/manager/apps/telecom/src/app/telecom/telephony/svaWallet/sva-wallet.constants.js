export const buildEnumList = (list, translationPrefix, $translate) =>
  list
    .map((value) => ({
      name: $translate.instant(`${translationPrefix}${value}`),
      value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

export const searchEnumItem = (list, search) =>
  Array.isArray(search)
    ? search.map((s) => searchEnumItem(list, s))
    : list.find(({ value }) => value === search);

export const getEnumItemValue = (item) =>
  Array.isArray(item) ? item.map((i) => getEnumItemValue(i)) : item.value;

export const isKYCValid = (wallet) => wallet.kycStatus === 'VALID';
export const isKYCUnderReview = (wallet) => wallet.kycStatus === 'UNDER_REVIEW';
export const isKYCWaitingDocument = (wallet) =>
  wallet.kycStatus === 'WAITING_FOR_DOCUMENT';
export const isKYCPending = (wallet) =>
  ['IN_PROGRESS', 'UNDER_REVIEW', 'WAITING_FOR_DOCUMENT'].includes(
    wallet.kycStatus,
  );
export const isKYCInError = (wallet) =>
  ['BLOCKED', 'EXPIRED'].includes(wallet.kycStatus);

export default {
  buildEnumList,
  searchEnumItem,
  getEnumItemValue,
  isKYCValid,
  isKYCUnderReview,
};
