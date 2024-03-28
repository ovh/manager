import { API_ERROR, GUIDE, PREFERENCES_KEY } from './iam.constants';

export const URL = {
  ACTION: '/engine/api/v2/iam/reference/action',
  IDENTITY_GROUP: '/me/identity/group',
  IDENTITY_USER: '/me/identity/user',
  SERVICE_ACCOUNT: '/me/api/oauth2/client/',
  PREFERENCES: '/me/preferences/manager',
  POLICY: '/engine/api/v2/iam/policy',
  RESOURCE: '/engine/api/v2/iam/resource',
  RESOURCE_GROUP: '/engine/api/v2/iam/resourceGroup',
  RESOURCE_TYPE: '/engine/api/v2/iam/reference/resource/type',
  PERMISSIONS_GROUPS: '/engine/api/v2/iam/permissionsGroup',
};

export default class IAMService {
  /* @ngInject */
  constructor($http, $q, $translate, coreConfig, Apiv2Service) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.Apiv2Service = Apiv2Service;
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
  // Users

  /**
   * Get user list
   * @returns {Promise<object[]>}
   */
  getUserList() {
    return this.$http
      .get(URL.IDENTITY_USER)
      .then(({ data }) =>
        this.$q.all(data.map((userId) => this.getUser(userId))),
      );
  }

  /**
   * Get one User
   * @returns {Promise<Object>}
   */
  getUser(userId) {
    return this.$http
      .get(`${URL.IDENTITY_USER}/${userId}`)
      .then(({ data }) => data);
  }

  // **********************************************************************************************
  // User Groups

  /**
   * Get user group list
   * @returns {Promise<object[]>}
   */
  getGroupList() {
    return this.$http
      .get(URL.IDENTITY_GROUP)
      .then(({ data }) =>
        this.$q.all(data.map((groupId) => this.getGroup(groupId))),
      );
  }

  /**
   * Get one User Group
   * @returns {Promise<Object>}
   */
  getGroup(groupId) {
    return this.$http
      .get(`${URL.IDENTITY_GROUP}/${groupId}`)
      .then(({ data }) => data);
  }

  // **********************************************************************************************
  // Service Accounts

  /**
   * Get one Service Account
   * @returns {Promise<Object>}
   */
  getServiceAccount(serviceAccountId) {
    return this.$http
      .get(`${URL.SERVICE_ACCOUNT}/${serviceAccountId}`)
      .then(({ data }) => data);
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
    return this.Apiv2Service.httpApiv2({
      method: 'post',
      url: URL.POLICY,
      data,
    }).then(({ data: policy }) => policy);
  }

  /**
   * Delete the policy given the id
   * @param {string} id The policy's id
   * @returns {Promise}
   */
  deletePolicy(id) {
    return this.Apiv2Service.httpApiv2({
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
        policy: this.Apiv2Service.httpApiv2({
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
    return this.Apiv2Service.httpApiv2List(
      { url: URL.POLICY, params },
      { cursor },
    ).then(({ data, ...rest }) => ({
      ...rest,
      data: data.map((policy) => IAMService.transformPolicy(policy)),
    }));
  }

  /**
   * Get the policy given the id
   * @param {string} id The policy's id
   * @returns {Promise}
   */
  getPolicy(id) {
    return this.Apiv2Service.httpApiv2({
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
    return this.Apiv2Service.httpApiv2({
      method: 'put',
      url: `${URL.POLICY}/${id}`,
      data,
    }).then(({ data: policy }) => IAMService.transformPolicy(policy));
  }

  /**
   * Modify a policie's identities given its id
   * @param {string} policyId The policy's id
   * @param {string[]} identities The policy's identities
   * @returns {Promise}
   */
  setPolicyIdentities(policyId, identities) {
    return this.getPolicy(policyId)
      .then((policyResponse) => {
        // remove fields from GET response which cannot be used in PUT query.
        // equivalent to delete policy.createdAt, delete policy.id ...
        const {
          createdAt,
          updatedAt,
          id,
          owner,
          readOnly,
          ...policy
        } = policyResponse;
        policy.identities = identities;
        return this.Apiv2Service.httpApiv2({
          method: 'put',
          url: `${URL.POLICY}/${policyId}`,
          data: policy,
        });
      })
      .then(({ data: policy }) => {
        IAMService.transformPolicy(policy);
      });
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
    return this.registerAdvancedMode().then(() =>
      this.$http.put(`${URL.PREFERENCES}/${PREFERENCES_KEY.ADVANCED_MODE}`, {
        value: 'false',
      }),
    );
  }

  /**
   * Enable the AdvancedMode
   * @returns {Promise<null>}
   */
  enableAdvancedMode() {
    return this.registerAdvancedMode().then(() =>
      this.$http.put(`${URL.PREFERENCES}/${PREFERENCES_KEY.ADVANCED_MODE}`, {
        value: 'true',
      }),
    );
  }

  /**
   * Whether the advanced mode is enabled
   * @returns {Promise<boolean>}
   */
  isAdvancedModeEnabled() {
    return this.registerAdvancedMode().then(() =>
      this.$http
        .get(`${URL.PREFERENCES}/${PREFERENCES_KEY.ADVANCED_MODE}`)
        .then(({ data: { value } }) => value === 'true'),
    );
  }

  /**
   * Register the IAM_ADVANCED_MODE key is in the preferences
   * If no preferences is set yet, set it to false ('false' as only string are allowed)
   * @returns {Promise<boolean>}
   */
  registerAdvancedMode() {
    return this.$http.get(URL.PREFERENCES).then(({ data: preferencesKeys }) => {
      if (!preferencesKeys.includes(PREFERENCES_KEY.ADVANCED_MODE)) {
        return this.$http.post(URL.PREFERENCES, {
          key: PREFERENCES_KEY.ADVANCED_MODE,
          value: 'false',
        });
      }
      return null;
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
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: URL.ACTION,
      params: { ...(types && { resourceType: types }) },
    }).then(({ data: actions }) => actions);
  }

  // **********************************************************************************************
  // Resource

  /**
   * Create a resource group
   * @param {{
   *   name: string
   *   resources?: { id: string }[]
   * }} data The resource group's data
   * @returns {Promise}
   */
  createResourceGroup(data) {
    return this.Apiv2Service.httpApiv2({
      method: 'post',
      url: `${URL.RESOURCE_GROUP}`,
      data,
    }).then(({ data: resourceGroup }) => resourceGroup);
  }

  /**
   * Delete the resourceGroup given the id
   * @param {string} id The resourceGroup's id
   * @returns {Promise}
   */
  deleteResourceGroup(id) {
    return this.Apiv2Service.httpApiv2({
      method: 'delete',
      url: `${URL.RESOURCE_GROUP}/${id}`,
    });
  }

  /**
   * Get the resourceGroup given the id populated with more data
   * @param {string} id The resourceGroup's id
   * @returns {Promise}
   */
  getDetailedResourceGroup(id) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `${URL.RESOURCE_GROUP}/${id}`,
      params: { details: true },
    }).then(({ data: resourceGroup }) => resourceGroup);
  }

  /**
   * Get the resourceGroup given the id
   * @param {string} id The resourceGroup's id
   * @returns {Promise}
   */
  getResourceGroup(id) {
    return this.Apiv2Service.httpApiv2({
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
    return this.Apiv2Service.httpApiv2List(
      { url: URL.RESOURCE_GROUP },
      { cursor },
    );
  }

  /**
   * Get the list of permissionsGroups
   * @returns {Promise}
   */
  getPermissionsGroups() {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: URL.PERMISSIONS_GROUPS,
    }).then(({ data }) => data);
  }

  /**
   * Modify a resource group
   * @param {string} id The resource group's id
   * @param {{
   *   name: string
   *   resources?: { id: string }[]
   * }} data The resource group's data
   * @returns {Promise}
   */
  setResourceGroup(id, data) {
    return this.Apiv2Service.httpApiv2({
      method: 'put',
      url: `${URL.RESOURCE_GROUP}/${id}`,
      data,
    }).then(({ data: resourceGroup }) => resourceGroup);
  }
}
