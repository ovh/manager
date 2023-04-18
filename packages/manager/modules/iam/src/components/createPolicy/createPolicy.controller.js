import { cloneDeep, isEqual } from 'lodash-es';

export default class CreatePolicyController {
  /* @ngInject */
  constructor($timeout, $translate, PolicyService, ResourceService) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.PolicyService = PolicyService;

    /**
     *
     * @type {{
     *   actions: Object[]
     *   name: string
     *   resources: Object[]
     * }?}
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
      actions: [],
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

    /**
     * Keep a copy of previously added resource types
     * So we can know witch resource type has been deleted during a change event
     * @type {string}
     */
    this.resourceTypes = [];

    /**
     * Urls for the oui-select load options
     * @type {Object<string,string>}
     */
    this.url = {
      resourceGroups: ResourceService.resourceGroupsUrl,
    };

    // Can be passed as reference to a component
    this.onResourceTypeDeleted = this.onResourceTypeDeleted.bind(this);
  }

  /**
   * Whether the current controller's state allow the data to be submitted
   * @type {boolean}
   */
  get canSubmit() {
    return !this.isSubmitting && this.form?.$valid;
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
   * Whether the user has selected at least one resource
   * @returns {boolean}
   */
  get hasSelectedResources() {
    return this.model.resources?.length > 0;
  }

  /**
   * Whether the user has selected at least one resource type
   * @returns {boolean}
   */
  get hasSelectedResourceTypes() {
    return this.model.resourceTypes?.length > 0;
  }

  /**
   * Whether the resourceTypes select is required
   * The use must select a resource on witch actions apply. This resource can be
   * - A resource from the resource select, with prior selection of a resource type
   * - A resource group
   * @returns {boolean}
   */
  get isResourceTypesRequired() {
    return !this.model.resourceGroups || !this.model.resourceGroups.length;
  }

  /**
   * A contextualized Set where each key map to a translation
   * @returns {Object<string,string>}
   */
  get translations() {
    const pfx = 'iam_create_policy';
    const { instant: $t } = this.$translate;
    return {
      heading: {
        name: $t(`${pfx}_form_name_heading`),
        resources: $t(`${pfx}_form_resources_heading`),
        resourceTypes: $t(`${pfx}_form_resource_types_heading`),
      },
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
  }

  /**
   * Cancel the policy creation by going back to the previous state
   * @returns {Promise}
   */
  cancelCreation() {
    return this.goBack();
  }

  /**
   * Create the policy
   * @returns {Promise}
   */
  createPolicy() {
    this.createSnapshot();
    this.isSubmitting = true;

    return this.PolicyService.createPolicy(this.toAPI())
      .then(() => {
        this.error = {};
        return this.goBack({
          success: {
            key: 'iam_create_policy_success',
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
   * Create a snapshot of the current model state
   * @see {modelSnapshot}
   */
  createSnapshot() {
    this.modelSnapshot = cloneDeep(this.model);
  }

  /**
   * Called back each time a resource types is deleted using the iamDeleteEntity component
   * @param {boolean} success
   */
  onResourceTypeDeleted({ success }) {
    const { actions, name: resourceType, resources } = this.deletion;
    this.deletion = null;

    if (!success) {
      this.model.resourceTypes = [...this.model.resourceTypes, resourceType];
      this.resourceTypes = [...this.model.resourceTypes];
      return;
    }
    this.model.actions = this.model.actions?.filter(
      (action) => !actions.includes(action),
    );
    this.model.resources = this.model.resources?.filter(
      (resource) => !resources.includes(resource),
    );
  }

  /**
   * Global error handler
   * @param {Error} error
   */
  onError(error) {
    const { message } = error.data ?? {};
    this.alert.error('iam_create_policy_error_creation', { message });
  }

  /**
   * Called back each time the resource types have changed
   * If a deletion is detected, ask the user for a confirmation
   */
  onResourceChanged(change) {
    if (change.type === 'resourceTypes') {
      const actionsToRemove = this.model.actions?.filter(
        ({ action, resourceType }) =>
          action !== '*' &&
          resourceType !== 'custom' &&
          !this.model.resourceTypes.includes(resourceType),
      );
      const resourcesToRemove = this.model.resources?.filter(
        ({ type }) => !this.model.resourceTypes.includes(type),
      );

      if (resourcesToRemove?.length || actionsToRemove?.length) {
        this.deletion = {
          // When oui-select triggers a change with an array as a value
          // It is actually a deletion
          name: this.resourceTypes
            .filter((resourceType) => !change.value.includes(resourceType))
            .pop(),
          actions: actionsToRemove,
          resources: resourcesToRemove,
        };
      }

      this.resourceTypes = [...(this.model.resourceTypes || [])];
    }
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
   * @see {PolicyService#createPolicy}
   * @returns {Object}
   */
  toAPI() {
    return {
      identities: [],
      name: this.model.name,
      permissions: {
        allow: this.model.actions.map(({ action }) => ({ action })),
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
