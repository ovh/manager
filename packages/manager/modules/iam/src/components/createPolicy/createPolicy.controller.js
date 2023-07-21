import { cloneDeep, isEqual } from 'lodash-es';

import { ENTITY, ENTITY_NAME_PATTERN } from '../../iam.constants';
import { URL } from '../../iam.service';

export default class CreatePolicyController {
  /* @ngInject */
  constructor($q, $timeout, $translate, IAMService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.IAMService = IAMService;

    this.ENTITY_NAME_PATTERN = ENTITY_NAME_PATTERN;
    this.ENTITY_RESOURCE_TYPE = ENTITY.RESOURCE_TYPE;
    this.URL_RESOURCE_GROUP = URL.RESOURCE_GROUP;

    /**
     * The oui-select confirm-remove property works with promises
     * Associated entities to delete when the user wants to remove a resourceType
     * @type {Object}
     */
    this.deletion = null;

    /**
     * A set of parsed error classes returned by the api
     * Keys are policy property names and values are translated errors
     *
     * For instance
     * { name: 'Some translated error' }
     *
     * @type {Object<string,string>}
     */
    this.error = {};

    /**
     * The NgFormController created by the template by using name="$ctrl.form"
     * @type {NgFormController}
     */
    this.form = null;

    /**
     * Whether the controller is submitting
     * @type {boolean}
     */
    this.isSubmitting = false;

    /**
     * The form's data model
     * @type {Object}
     */
    this.model = {
      actions: { selection: [], isWildcardActive: false },
      name: '',
      resources: [],
      resourceGroups: [],
      resourceTypes: [],
    };

    /**
     * When the user submits the data, a snapshot of the model is created
     * If any error occures after the submission, it prevents the user from submitting the same data
     * @see {model}
     */
    this.modelSnapshot = null;

    /**
     * List of resource groups loaded by the oui-select
     * @type {Object[]?}
     */
    this.resourceGroups = null;

    // Can be passed as reference to a component
    this.onDeleteEntityGoBack = this.onDeleteEntityGoBack.bind(this);
  }

  /**
   * Whether the current controller's state allow the data to be submitted
   * @type {boolean}
   */
  get canSubmit() {
    return !this.isSubmitting && this.form?.$valid && !this.policy?.readOnly;
  }

  /**
   * Returns a list of form controls with a $validators attribute
   * E.g. instances of NgModelController
   * @returns {Object[]}
   */
  get formControls() {
    if (this.form) {
      return this.form.$$controls.filter(({ $validators }) => !!$validators);
    }
    return [];
  }

  /**
   * Whether there is any error coming from the api
   * @type {boolean}
   */
  get hasAnyError() {
    return Object.values(this.error).length > 0;
  }

  /**
   * Whether the user has registered resource groups
   * Default is true until the api respond
   * @returns {boolean}
   */
  get hasResourceGroups() {
    return this.resourceGroups === null || this.resourceGroups.length > 0;
  }

  /**
   * Whether the user has selected at least one resource type
   * @returns {boolean}
   */
  get hasSelectedResourceTypes() {
    return this.model.resourceTypes?.length > 0;
  }

  /**
   * THe Current controller's mode. If any policy is given, it is edition mode
   * Otherwise, it is creation mode
   * @returns {'create'|'edit'}
   */
  get mode() {
    return this.policy ? 'edit' : 'create';
  }

  /**
   * A contextualized Set where each key map to a translation
   * @returns {Object<string,string>}
   */
  get translations() {
    const pfx = 'iam_create_policy';
    const { mode } = this;
    return {
      error: `${pfx}_error_${mode}`,
      errorHeading: `${pfx}_error_heading_${mode}`,
      formHeading: {
        name: `${pfx}_form_name_heading`,
        resources: `${pfx}_form_resources_heading`,
        resourceTypes: `${pfx}_form_resource_types_heading`,
      },
      header: `${pfx}_header_heading_${mode}`,
      submit: `${pfx}_submit_${mode}`,
      success: `${pfx}_success_${mode}`,
    };
  }

  $onInit() {
    // Wait for this.form to be attached
    // Can't use $postLink because oui-select are not attached at this time
    this.$timeout(() => {
      this.formControls.forEach((control) => {
        const { $name: property } = control;
        Object.assign(control.$validators, {
          // Each control is given this validator
          // It fails if :
          // - The API returns an error specific to that control
          // - The model of that control has not changed since the last submission
          api: (model) =>
            !this.error[property] ||
            !isEqual(model, this.modelSnapshot?.[property]),
        });
      });
    });

    // Edit mode, feed the model
    if (this.mode === 'edit') {
      const wildcardAction = this.policy.permissions.allow.find(
        ({ action }) => action === '*',
      );
      this.model.actions.selection = this.policy.permissions.allow.filter(
        (action) => action !== wildcardAction,
      );
      this.model.actions.isWildcardActive = Boolean(wildcardAction);
      this.model.name = this.policy.name;
      this.model.resources = this.policy.resources
        .filter(({ resource }) => Boolean(resource))
        .map(({ resource }) => resource);
      this.model.resourceGroups = this.policy.resources
        .filter(({ group }) => Boolean(group))
        .map(({ group }) => group);
      this.model.resourceTypes = [
        ...this.model.resources.map(({ type }) => type),
        ...this.model.actions.selection.map(({ resourceType }) => resourceType),
      ].filter(
        (resourceType, index, list) =>
          Boolean(resourceType) && list.indexOf(resourceType) === index,
      );
    }
  }

  /**
   * Cancel the policy creation by going back to the previous state
   * @returns {Promise}
   */
  cancelCreation() {
    return this.goBack();
  }

  /**
   * Create a snapshot of the current model state
   * @see {modelSnapshot}
   */
  createSnapshot() {
    this.modelSnapshot = cloneDeep(this.model);
  }

  /**
   * Global error handler
   * @param {Error} error
   */
  onError(error) {
    const { message } = error.data ?? {};
    this.alert.error(this.translations.error, { message });
  }

  /**
   * Called back each time the resourceGroups have loaded
   * @param {Array} resourceGroups
   */
  onResourceGroupsLoaded(resourceGroups) {
    this.resourceGroups = resourceGroups;
    // Restore references to the model
    // /!\ Avoid having the same selected item twice
    if (this.model.resourceGroups?.length) {
      this.model.resourceGroups = this.model.resourceGroups.map(
        (resourceGroup) =>
          resourceGroups.find(({ id }) => resourceGroup.id === id) ||
          resourceGroup,
      );
    }
  }

  /**
   * Called back each time a resource types is deleted using the iamDeleteEntity component
   * @param {boolean} success
   */
  onDeleteEntityGoBack({ success }) {
    if (success) {
      this.model.actions.selection = this.model.actions.selection.filter(
        (action) => !this.deletion.data.actions.includes(action),
      );
      this.model.resources = this.model.resources?.filter(
        (resource) => !this.deletion.data.resources.includes(resource),
      );
    }
    this.deletion.resolve(success);
    this.deletion = null;
  }

  /**
   * Called back each time a resource types is about to be deleted
   * If a deletion is detected, ask the user for a confirmation
   * @param {string} resourceType The resource type to delete
   */
  onResourceTypesConfirmRemove(resourceType) {
    const actions = this.model.actions.selection.filter(
      (action) => action.resourceType === resourceType,
    );
    const resources = this.model.resources?.filter(
      (resource) => resource.type === resourceType,
    );

    if (actions?.length || resources?.length) {
      this.deletion = this.$q.defer();
      this.deletion.data = { name: resourceType, actions, resources };
      return this.deletion.promise;
    }

    return this.$q.when(true);
  }

  /**
   * Called back when the form is submitted
   * @returns {Promise}
   */
  onSubmit() {
    this.createSnapshot();
    this.isSubmitting = true;

    const promise =
      this.mode === 'edit'
        ? this.IAMService.setPolicy(this.policy.id, this.toAPI())
        : this.IAMService.createPolicy(this.toAPI());

    return promise
      .then(() => {
        this.error = {};
        return this.goBack({
          success: {
            key: this.translations.success,
            values: { name: `<strong>${this.model.name}</strong>` },
          },
          reload: true,
        });
      })
      .catch((error) => {
        this.isSubmitting = false;

        if (error.data.policy) {
          this.error = error.data.policy;
          this.runValidation();
          return;
        }

        this.error = {};
        this.onError(error);
      });
  }

  /**
   * Because we attach custom validation to the form's controls
   * We need a way to validate them on demand
   */
  runValidation() {
    // Gives time to the error-messages attributes to react
    this.$timeout(() => {
      this.formControls.forEach((control) => {
        control.$setDirty();
        control.$validate();
      });
    });
  }

  /**
   * Transform the current model to an API compliant data
   * @see {IAMService#createPolicy}
   * @returns {Object}
   */
  toAPI() {
    return {
      identities: [],
      name: this.model.name,
      permissions: {
        allow: this.model.actions.isWildcardActive
          ? [{ action: '*' }]
          : this.model.actions.selection.map(({ action }) => ({ action })),
      },
      resources: [
        ...new Map(
          [
            ...this.model.resources.map(({ urn }) => ({ urn })),
            ...this.model.resourceGroups.map(({ urn }) => ({ urn })),
          ].map((resource) => [resource.urn, resource]),
        ).values(),
      ],
    };
  }
}
