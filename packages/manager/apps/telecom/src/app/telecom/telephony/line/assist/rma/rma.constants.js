export const MAC_ADDRESS_FORMAT_REGEX = /\w{1,2}/g;

export const RMA_URL_PREFIX =
  'https://www.ovh.com/cgi-bin/telephony/rma.pl?reference=';

export const TEXT_FOR_MODAL = {
  cancelRma: 'telephony_line_assist_rma_cancel',
  equipmentOutOfOrder: 'telephony_line_assist_rma_equipment_out_of_order',
  keepingLine: 'telephony_line_assist_rma_keeping_line',
  terminateLine: 'telephony_line_assist_rma_terminate_line',
};

export const ACTION_TYPE = {
  cancelRma: 'cancelRma',
  equipmentOutOfOrder: 'equipmentOutOfOrder',
  keepingLine: 'keepingLine',
  terminateLine: 'terminateLine',
};

export const RMA_NEW_TYPE = {
  toSip: 'toSip',
  resiliate: 'resiliate',
};

export const PREFIX_TRACKING =
  'telecom::telephony::billingAccount::line::dashboard::assist::';

export default {
  MAC_ADDRESS_FORMAT_REGEX,
  RMA_URL_PREFIX,
  TEXT_FOR_MODAL,
  ACTION_TYPE,
  RMA_NEW_TYPE,
  PREFIX_TRACKING,
};
