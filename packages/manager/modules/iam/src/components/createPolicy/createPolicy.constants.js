import {
  MY_POLICIES_TRACKING_HITS,
  MY_POLICIES_TRACKING_PREFIX,
} from '../../policies/myPolicies/myPolicies.constants';

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
    prefix: MY_POLICIES_TRACKING_PREFIX,
    cancel: MY_POLICIES_TRACKING_HITS.CREATE_POLICY_CANCEL,
    removeResourceType:
      MY_POLICIES_TRACKING_HITS.CREATE_POLICY_REMOVE_RESOURCE_TYPE,
    submit: MY_POLICIES_TRACKING_HITS.CREATE_POLICY_CONFIRM,
    submitError: MY_POLICIES_TRACKING_HITS.CREATE_POLICY_ERROR,
    submitSuccess: MY_POLICIES_TRACKING_HITS.CREATE_POLICY_SUCCESS,
  },
  edit: {
    prefix: MY_POLICIES_TRACKING_PREFIX,
    cancel: MY_POLICIES_TRACKING_HITS.EDIT_POLICY_CANCEL,
    removeResourceType:
      MY_POLICIES_TRACKING_HITS.EDIT_POLICY_REMOVE_RESOURCE_TYPE,
    submit: MY_POLICIES_TRACKING_HITS.EDIT_POLICY_CONFIRM,
    submitError: MY_POLICIES_TRACKING_HITS.EDIT_POLICY_ERROR,
    submitSuccess: MY_POLICIES_TRACKING_HITS.EDIT_POLICY_SUCCESS,
  },
};

export default {
  CREATE_POLICY_TAG,
};
