import { TAG } from '../../iam.constants';

/**
 * @typedef {{
 *   cancel: string;
 *   prefix: string;
 *   removeResourceType: string;
 *   submit: string;
 *   submitError: string;
 *   submitSuccess: string;
 * }} CreatePolicyTag
 */

/**
 * @type {{
 *   create: CreatePolicyTag;
 *   edit: CreatePolicyTag;
 * }}
 */
export const CREATE_POLICY_TAG = {
  create: {
    cancel: TAG.ADD_POLICY__CANCEL,
    prefix: TAG.ADD_POLICY,
    removeResourceType: TAG.ADD_POLICY__REMOVE_PRODUCT_TYPE,
    submit: TAG.ADD_POLICY__CONFIRM,
    submitError: TAG.POLICIES__CREATE_POLICY_CONFIRM_BANNER__ERROR,
    submitSuccess: TAG.POLICIES__CREATE_POLICY_CONFIRM_BANNER__SUCCESS,
  },
  edit: {
    cancel: TAG.EDIT_POLICY__CANCEL,
    prefix: TAG.EDIT_POLICY,
    removeResourceType: TAG.EDIT_POLICY__REMOVE_PRODUCT_TYPE,
    submit: TAG.EDIT_POLICY__CONFIRM,
    submitError: TAG.POLICIES__EDIT_POLICY_CONFIRM_BANNER__ERROR,
    submitSuccess: TAG.POLICIES__EDIT_POLICY_CONFIRM_BANNER__SUCCESS,
  },
};

export default {
  CREATE_POLICY_TAG,
};
