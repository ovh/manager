import {
  RESOURCE_GROUPS_TRACKING_HITS,
  RESOURCE_GROUPS_TRACKING_PREFIX,
} from '../../policies/resourceGroups/resourceGroups.constants';

/**
 * @typedef {{
 *   cancel: string;
 *   prefix: string;
 *   removeResourceType: string;
 *   submit: string;
 *   submitError: string;
 *   submitSuccess: string;
 * }} CreateResourceGroupTag
 */

/**
 * @type {{
 *   create: CreateResourceGroupTag;
 *   edit: CreateResourceGroupTag;
 * }}
 */
export const CREATE_RESOURCE_GROUP_TAG = {
  create: {
    prefix: RESOURCE_GROUPS_TRACKING_PREFIX,
    cancel: RESOURCE_GROUPS_TRACKING_HITS.ADD_RESOURCE_GROUP_CANCEL,
    removeResourceType:
      RESOURCE_GROUPS_TRACKING_HITS.ADD_RESOURCE_GROUP_REMOVE_PRODUCT_TYPE,
    submit: RESOURCE_GROUPS_TRACKING_HITS.ADD_RESOURCE_GROUP_CONFIRM,
    submitError: RESOURCE_GROUPS_TRACKING_HITS.ADD_RESOURCE_GROUP_ERROR,
    submitSuccess: RESOURCE_GROUPS_TRACKING_HITS.ADD_RESOURCE_GROUP_SUCCESS,
  },
  edit: {
    prefix: RESOURCE_GROUPS_TRACKING_PREFIX,
    cancel: RESOURCE_GROUPS_TRACKING_HITS.UPDATE_RESOURCE_GROUP_CANCEL,
    removeResourceType:
      RESOURCE_GROUPS_TRACKING_HITS.UPDATE_RESOURCE_GROUP_REMOVE_PRODUCT_TYPE,
    submit: RESOURCE_GROUPS_TRACKING_HITS.UPDATE_RESOURCE_GROUP_CONFIRM,
    submitError: RESOURCE_GROUPS_TRACKING_HITS.UPDATE_RESOURCE_GROUP_ERROR,
    submitSuccess: RESOURCE_GROUPS_TRACKING_HITS.UPDATE_RESOURCE_GROUP_SUCCESS,
  },
};

export const CREATE_RESOURCE_GROUP_MAX_SIZE = 100;

export default {
  CREATE_RESOURCE_GROUP_TAG,
  CREATE_RESOURCE_GROUP_MAX_SIZE,
};
