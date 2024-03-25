import { ACTIONS, ACTION_LABELS } from '../../constants';

export const URL_PATTERN = /^(http(s)?:\/\/)[\w.-]+[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/;

export const URL_PLACEHOLDER = 'https://example.com';

export const ACTIONS_LIST = [
  {
    value: ACTIONS.REDIRECT_TO_URL,
    label: ACTION_LABELS[ACTIONS.REDIRECT_TO_URL],
  },
  {
    value: ACTIONS.REDIRECT_TO_POOL,
    label: ACTION_LABELS[ACTIONS.REDIRECT_TO_POOL],
  },
  {
    value: ACTIONS.REDIRECT_PREFIX,
    label: ACTION_LABELS[ACTIONS.REDIRECT_PREFIX],
  },
  {
    value: ACTIONS.REJECT,
    label: ACTION_LABELS[ACTIONS.REJECT],
  },
];

export default {
  URL_PATTERN,
  URL_PLACEHOLDER,
  ACTIONS_LIST,
};
