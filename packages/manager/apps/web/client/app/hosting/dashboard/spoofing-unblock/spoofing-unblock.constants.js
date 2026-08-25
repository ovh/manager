const EMAIL_SENDING_DOC = 'https://docs.ovhcloud.com';
const EMAIL_SENDING_PATH =
  '/guides/web-cloud/web-hosting/email-sending-best-practices';

export const EMAIL_SENDING_GUIDE_URL = {
  FR: `${EMAIL_SENDING_DOC}/fr${EMAIL_SENDING_PATH}`,
  QC: `${EMAIL_SENDING_DOC}/fr${EMAIL_SENDING_PATH}`,
  MA: `${EMAIL_SENDING_DOC}/fr${EMAIL_SENDING_PATH}`,
  SN: `${EMAIL_SENDING_DOC}/fr${EMAIL_SENDING_PATH}`,
  TN: `${EMAIL_SENDING_DOC}/fr${EMAIL_SENDING_PATH}`,
  DEFAULT: `${EMAIL_SENDING_DOC}/en${EMAIL_SENDING_PATH}`,
};

export const SPOOFING_LATER_STORAGE_PREFIX = 'hosting-spoofing-later-';

export default {
  EMAIL_SENDING_GUIDE_URL,
  SPOOFING_LATER_STORAGE_PREFIX,
};
