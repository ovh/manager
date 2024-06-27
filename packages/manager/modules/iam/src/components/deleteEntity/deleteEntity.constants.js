import { ENTITY, TAG } from '../../iam.constants';

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
    close: TAG.DELETE_POLICY__CANCEL,
    delete: TAG.DELETE_POLICY__CONFIRM,
    error: TAG.POLICIES__DELETE_POLICY_CONFIRM_BANNER__ERROR,
    success: TAG.POLICIES__DELETE_POLICY_CONFIRM_BANNER__SUCCESS,
  },
  [ENTITY.RESOURCE_TYPE]: {
    close: TAG.REMOVE_PRODUCT_TYPE_CANCEL,
    delete: TAG.REMOVE_PRODUCT_TYPE_CONFIRM,
  },
  [ENTITY.RESOURCE_GROUP]: {
    close: TAG.DELETE_RESOURCE_GROUP__CANCEL,
    delete: TAG.DELETE_RESOURCE_GROUP__CONFIRM,
    error: TAG.RESOURCE_GROUPS__DELETE_GROUP_CONFIRM_BANNER__ERROR,
    success: TAG.RESOURCE_GROUPS__DELETE_GROUP_CONFIRM_BANNER__SUCCESS,
  },
};

export default {
  DELETE_ENTITY_TAG,
};
