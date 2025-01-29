export const CREATE_ERASURE_REQUEST_ACTION =
  'account:apiovh:me/privacy/requests/erasure/create';

export const GDPR_REQUEST_MANAGEMENT_ACTIONS = [
  {
    name: 'account:apiovh:me/privacy/requests/get',
    madatory: true,
  },
  {
    name: 'account:apiovh:me/privacy/requests/capabilities/get',
    madatory: true,
  },
  {
    name: CREATE_ERASURE_REQUEST_ACTION,
    madatory: false,
  },
];

export default {
  GDPR_REQUEST_MANAGEMENT_ACTIONS,
  CREATE_ERASURE_REQUEST_ACTION,
};
