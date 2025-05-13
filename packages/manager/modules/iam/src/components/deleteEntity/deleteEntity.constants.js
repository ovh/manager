import { ENTITY, TAG } from '../../iam.constants';
import { API_KEYS_TRACKING_HITS } from '../../api-keys/api-keys.constants';
import { MY_POLICIES_TRACKING_HITS } from '../../policies/myPolicies/myPolicies.constants';
import { RESOURCE_GROUPS_TRACKING_HITS } from '../../policies/resourceGroups/resourceGroups.constants';

/**
 * @typedef {{
 *   close: string;
 *   delete: string;
 *   error?: string;
 *   success?: string;
 * }} DeleteEntityTag
 */

/**
 * @type {Object<string, DeleteEntityTag>}
 */
export const DELETE_ENTITY_TAG = {
  [ENTITY.POLICY]: {
    close: MY_POLICIES_TRACKING_HITS.DELETE_POLICY_CANCEL,
    delete: MY_POLICIES_TRACKING_HITS.DELETE_POLICY_CONFIRM,
    error: MY_POLICIES_TRACKING_HITS.DELETE_POLICY_ERROR,
    success: MY_POLICIES_TRACKING_HITS.DELETE_POLICY_SUCCESS,
  },
  [ENTITY.RESOURCE_TYPE]: {
    close: TAG.REMOVE_PRODUCT_TYPE_CANCEL,
    delete: TAG.REMOVE_PRODUCT_TYPE_CONFIRM,
  },
  [ENTITY.RESOURCE_GROUP]: {
    close: RESOURCE_GROUPS_TRACKING_HITS.DELETE_RESOURCE_GROUP_CANCEL,
    delete: RESOURCE_GROUPS_TRACKING_HITS.DELETE_RESOURCE_GROUP_CONFIRM,
    error: RESOURCE_GROUPS_TRACKING_HITS.DELETE_RESOURCE_GROUP_ERROR,
    success: RESOURCE_GROUPS_TRACKING_HITS.DELETE_RESOURCE_GROUP_SUCCESS,
  },
  [ENTITY.API_KEY]: {
    close: API_KEYS_TRACKING_HITS.DELETE_CANCEL,
    delete: API_KEYS_TRACKING_HITS.DELETE_CONFIRM,
    error: API_KEYS_TRACKING_HITS.DELETE_ERROR,
    success: API_KEYS_TRACKING_HITS.DELETE_SUCCESS,
  },
};

export default {
  DELETE_ENTITY_TAG,
};
