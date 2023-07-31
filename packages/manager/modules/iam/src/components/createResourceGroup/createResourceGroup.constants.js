import { TAG } from '../../iam.constants';

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
    cancel: TAG.ADD_RESOURCE_GROUP__CANCEL,
    prefix: TAG.ADD_RESOURCE_GROUP,
    removeResourceType: TAG.ADD_RESOURCE_GROUP__REMOVE_PRODUCT_TYPE,
    submit: TAG.ADD_RESOURCE_GROUP__CONFIRM,
    submitError: TAG.RESOURCE_GROUPS__ADD_GROUP_CONFIRM_BANNER__ERROR,
    submitSuccess: TAG.RESOURCE_GROUPS__ADD_GROUP_CONFIRM_BANNER__SUCCESS,
  },
  edit: {
    cancel: TAG.EDIT_RESOURCE_GROUP__CANCEL,
    prefix: TAG.EDIT_RESOURCE_GROUP,
    removeResourceType: TAG.EDIT_RESOURCE_GROUP__REMOVE_PRODUCT_TYPE,
    submit: TAG.EDIT_RESOURCE_GROUP__CONFIRM,
    submitError: TAG.RESOURCE_GROUPS__EDIT_GROUP_CONFIRM_BANNER__ERROR,
    submitSuccess: TAG.RESOURCE_GROUPS__EDIT_GROUP_CONFIRM_BANNER__SUCCESS,
  },
};

export default {
  CREATE_RESOURCE_GROUP_TAG,
};
