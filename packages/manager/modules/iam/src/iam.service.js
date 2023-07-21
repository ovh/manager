import { API_ERROR, GUIDE, PAGE_SIZE, PREFERENCES_KEY } from './iam.constants';

export const URL = {
  ACTION: '/engine/api/v2/iam/reference/action',
  IDENTITY_GROUP: '/me/identity/group',
  IDENTITY_USER: '/me/identity/user',
  PREFERENCES: '/me/preferences/manager',
  POLICY: '/engine/api/v2/iam/policy',
  RESOURCE: '/engine/api/v2/iam/resource',
  RESOURCE_GROUP: '/engine/api/v2/iam/resourceGroup',
  RESOURCE_TYPE: '/engine/api/v2/iam/reference/resource/type',
};

export default class IAMService {
  /* @ngInject */
  constructor($http, $q, $translate, coreConfig) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;

    /**
     * Whether the advanced mode key is already set in the preferences
     * @type {boolean}
     */
    this.isAdvancedModeRegistered = false;
  }

  // **********************************************************************************************
  // API v2

  /**
   * Call the given endpoint on the API v2
   * @param {object} options the $http options
   * @returns {Promise}
   */
  httpApiv2(options) {
    return this.$http({
      ...options,
      serviceType: 'apiv2',
    }).catch((error) => this.parseError(error));
  }

  /**
   * Call the given list endpoint on the API v2 that implements the cursor api
   * @param {Object} options The $http options
   * @param {string=} cursor The cursor id
   * @param {number=} size The page size. Default is 25
   * @returns {Promise}
   */
  httpApiv2List(options, { cursor, size = PAGE_SIZE }) {
    return this.httpApiv2({
      ...options,
      method: 'get',
      headers: {
        ...options?.headers,
        ...(cursor && { 'X-Pagination-Cursor': cursor }),
        'X-Pagination-size': size,
      },
    })
      .then(({ data, headers }) => ({
        data,
        cursor: {
          next: headers('X-Pagination-Cursor-Next'),
          prev: headers('X-Pagination-Cursor-Prev'), // not available ATM
        },
      }))
      .catch((error) => {
        if (error.status === 400 && error.data?.message === 'invalid cursor') {
          return { cursor: { error: true } };
        }
        throw error;
      });
  }

  /**
   * Augment the passed error with data that tells on witch entities and witch parameters
   * the error class given by the API applies, and translate each combination of [entity/parameter]
   * that matches this error class
   *
   * For instance the rejected error may contain :
   *
   * data: {
   *   class: 'POLICY_ALREADY_EXISTS',
   *   policy: {
   *     name: 'the translated error',
   *     ...
   *   }
   * }
   *
   * @param {Error} error
   * @throws {Error}
   */
  parseError(error) {
    const { data = {} } = error;
    const klass = data.class?.split('::').pop();

    if (!klass) {
      throw error;
    }

    Object.entries(API_ERROR).forEach(([entity, properties]) => {
      Object.entries(properties).forEach(([property, errors]) => {
        if (errors.includes(klass)) {
          Object.assign(data, {
            [entity.toLowerCase()]: {
              ...(data[entity] ?? {}),
              [property.toLowerCase()]: this.$translate.instant(
                `iam_apiv2_error_${entity}_${property}_${klass}`,
              ),
            },
          });
        }
      });
    });

    Object.assign(error, { data: { ...data, class: klass } });
    throw error;
  }

  // **********************************************************************************************
  // Guide

  /**
   * Format the given list of guides based on the current user's subsidiary
   * for direct use in templates
   * @param {GUIDE[]} guides A list of GUIDE constants
   * @returns {{ key: string, link: string, title: string, description: string }[]}
   */
  formatGuides(...guides) {
    return Object.entries(GUIDE)
      .filter(([, guide]) => guides.includes(guide))
      .map(([key, guide]) => {
        const lowerKey = key.toLowerCase();
        return {
          key: lowerKey,
          link: guide[this.coreConfig.getUser().ovhSubsidiary] || guide.DEFAULT,
          title: this.$translate.instant(`iam_guide_${lowerKey}`),
          description: this.$translate.instant(
            `iam_guide_description_${lowerKey}`,
          ),
          // TODO augment with tracking data
        };
      });
  }

  // **********************************************************************************************
  // Identity

  /**
   * Get the list of identity groups
   * @returns {Promise<string[]>}
   */
  getIdentityGroups() {
    return this.$http.get(URL.IDENTITY_GROUP).then(({ data }) => data);
  }

  /**
   * Get the list of identity users
   * @returns {Promise<string[]>}
   */
  getIdentityUsers() {
    return this.$http.get(URL.IDENTITY_USER).then(({ data }) => data);
  }

  // **********************************************************************************************
  // Policy

  /**
   * Create a new policy
   * @param {{
   *   identities?: string[]
   *   name: string
   *   permissions: {
   *     allow?: { action: string }[]
   *     except?: { action: string }[]
   *   }
   *   resources?: { urn: string }[]
   * }} data The policy's data
   * @returns {Promise}
   */
  createPolicy(data) {
    return this.httpApiv2({ method: 'post', url: URL.POLICY, data }).then(
      ({ data: policy }) => policy,
    );
  }

  /**
   * Delete the policy given the id
   * @param {string} id The policy's id
   * @returns {Promise}
   */
  deletePolicy(id) {
    return this.httpApiv2({
      method: 'delete',
      url: `${URL.POLICY}/${id}`,
    }).then(({ data }) => data);
  }

  /**
   * Get the policy given the id populated with more data
   * @param {string} id The policy's id
   * @returns {Promise}
   */
  getDetailedPolicy(id) {
    return this.$q
      .all({
        actions: this.getActions(),
        policy: this.httpApiv2({
          method: 'get',
          url: `${URL.POLICY}/${id}`,
          params: { details: true },
        }).then(({ data: policy }) => policy),
      })
      .then(({ actions, policy }) =>
        IAMService.transformPolicy(policy, actions),
      );
  }

  /**
   * Get the list of policies
   * @param {string} cursor The base64 encoded cursor to pass
   * @param {boolean} readOnly
   * @returns {Promise}
   */
  getPolicies({ cursor, readOnly }) {
    const params = {};
    if (typeof readOnly !== 'undefined') {
      params.readOnly = readOnly;
    }
    return this.httpApiv2List({ url: URL.POLICY, params }, { cursor }).then(
      ({ data, ...rest }) => ({
        ...rest,
        data: data.map((policy) => IAMService.transformPolicy(policy)),
      }),
    );
  }

  /**
   * Get the policy given the id
   * @param {string} id The policy's id
   * @returns {Promise}
   */
  getPolicy(id) {
    return this.httpApiv2({
      method: 'get',
      url: `${URL.POLICY}/${id}`,
    }).then(({ data: policy }) => IAMService.transformPolicy(policy));
  }

  /**
   * Modify a policy
   * @param {string} id The policy's id
   * @param {{
   *   identities?: string[]
   *   name: string
   *   permissions: {
   *     allow?: { action: string }[]
   *     except?: { action: string }[]
   *   }
   *   resources?: { urn: string }[]
   * }} data The policy's data
   * @returns {Promise}
   */
  setPolicy(id, data) {
    return this.httpApiv2({
      method: 'put',
      url: `${URL.POLICY}/${id}`,
      data,
    }).then(({ data: policy }) => IAMService.transformPolicy(policy));
  }

  /**
   * Modify a policie's identities given its id
   * @param {string} id The policy's id
   * @param {string[]} identities The policy's identities
   * @returns {Promise}
   */
  setPolicyIdentities(id, identities) {
    return this.getPolicy(id)
      .then((policy) => {
        const { name, resources, permissions } = policy;
        return this.httpApiv2({
          method: 'put',
          url: `${URL.POLICY}/${id}`,
          data: { name, resources, permissions, identities },
        });
      })
      .then(({ data: policy }) => IAMService.transformPolicy(policy));
  }

  /**
   * - Ensure the presence of policy.permissions.allow is the policy data
   * - Instanciate the dates
   * @param {Object} policy
   * @param {Array?} actions
   * @returns {Object}
   */
  static transformPolicy(policy, actions = []) {
    Object.assign(policy, {
      createdAt: new Date(policy.createdAt),
      updatedAt: new Date(policy.updatedAt),
      permissions: {
        ...policy.permissions,
        allow: Array.isArray(policy.permissions.allow)
          ? policy.permissions.allow.map(
              (allow) =>
                actions.find((action) => action.action === allow.action) ||
                allow,
            )
          : [],
      },
    });
    return policy;
  }

  // **********************************************************************************************
  // Preferences

  /**
   * Disable the AdvancedMode
   * @returns {Promise<null>}
   */
  disableAdvancedMode() {
    return this.$http.put(
      `${URL.PREFERENCES}/${PREFERENCES_KEY.ADVANCED_MODE}`,
      { value: 'false' },
    );
  }

  /**
   * Enable the AdvancedMode
   * @returns {Promise<null>}
   */
  enableAdvancedMode() {
    return this.$http.put(
      `${URL.PREFERENCES}/${PREFERENCES_KEY.ADVANCED_MODE}`,
      { value: 'true' },
    );
  }

  /**
   * Whether the advanced mode is enabled
   * @returns {Promise<boolean>}
   */
  isAdvancedModeEnabled() {
    return this.$http
      .get(`${URL.PREFERENCES}/${PREFERENCES_KEY.ADVANCED_MODE}`)
      .then(({ data: { value } }) => value === 'true');
  }

  /**
   * Register the IAM_ADVANCED_MODE key is in the preferences
   * If no preferences is set yet, set it to false ('false' as only string are allowed)
   * @returns {Promise<boolean>}
   */
  registerAdvancedMode() {
    if (this.isAdvancedModeRegistered) {
      return this.$q.when(true);
    }
    const register = () => {
      this.isAdvancedModeRegistered = true;
      return true;
    };
    return this.isAdvancedModeEnabled()
      .then(register)
      .catch((error) => {
        if (error.status === 404) {
          return this.$http
            .post(URL.PREFERENCES, {
              key: PREFERENCES_KEY.ADVANCED_MODE,
              value: 'false',
            })
            .then(register);
        }
        throw error;
      });
  }

  // **********************************************************************************************
  // Reference

  /**
   * Get the list of actions given the types
   * @param {string[]?} types
   * @returns {Promise}
   */
  getActions(types) {
    return this.httpApiv2({
      method: 'get',
      url: URL.ACTION,
      params: { ...(types && { resourceType: types }) },
    }).then(({ data: actions }) => actions);
  }

  /**
   * Get the list of resource types
   * @returns {Promise}
   */
  getResourceTypes() {
    return this.httpApiv2({
      method: 'get',
      url: URL.RESOURCE_TYPE,
    }).then(({ data: resourceTypes }) => resourceTypes.sort());
  }

  // **********************************************************************************************
  // Resource

  /**
   * Delete the resourceGroup given the id
   * @param {string} id The resourceGroup's id
   * @returns {Promise}
   */
  deleteResourceGroup(id) {
    return this.httpApiv2({
      method: 'delete',
      url: `${URL.RESOURCE_GROUP}/${id}`,
    });
  }

  /**
   * Get the resourceGroup given the id
   * @param {string} id The resourceGroup's id
   * @returns {Promise}
   */
  getResourceGroup(id) {
    return this.httpApiv2({
      method: 'get',
      url: `${URL.RESOURCE_GROUP}/${id}`,
    }).then(({ data: resourceGroup }) => resourceGroup);
  }

  /**
   * Get the list of resourceGroups
   * @param {string} cursor The base64 encoded cursor to pass
   * @returns {Promise}
   */
  getResourceGroups({ cursor }) {
    return this.httpApiv2List({ url: URL.RESOURCE_GROUP }, { cursor });
  }
}
