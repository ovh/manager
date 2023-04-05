import { cloneDeep, isEqual } from 'lodash-es';

export default class CreatePolicyController {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    PolicyService,
    ReferenceService,
    ResourceService,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.PolicyService = PolicyService;
    this.ResourceService = ResourceService;

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
     * @type {Object[]}
     */
    this.resourceGroups = [];

    /**
     * Urls for the oui-select load options
     * @type {Object<string,string>}
     */
    this.url = {
      resources: ResourceService.resourcesUrl,
      resourceGroups: ResourceService.resourceGroupsUrl,
      resourceTypes: ReferenceService.resourceTypesUrl,
    };
  }

  /**
   * Whether the current controller's state allow the data to be submitted
   * @type {boolean}
   */
  get canSubmit() {
    return !this.isSubmitting && this.form?.$valid;
  }

  /**
   * Whether there is any error coming from the api
   * @type {boolean}
   */
  get hasAnyError() {
    const errors = Object.values(this.error);
    const onlySilentErrors = errors.every(({ silent }) => silent);
    if (!errors.length || onlySilentErrors) {
      return false;
    }
    return true;
  }

  /**
   * Whether the user has registered resource groups
   * @returns {boolean}
   */
  get hasResourceGroups() {
    return this.resourceGroups.length > 0;
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
    return !this.model.resourceGroups || this.model.resourceGroups.length === 0;
  }

  /**
   * Returns a list of form controls with a $validators attribute
   * E.g. instances of NgModelController
   * @returns {Object[]}
   */
  get formControls() {
    return (
      this.form?.$$controls.filter(({ $validators }) => !!$validators) || []
    );
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
      noResources: $t(`${pfx}_error_no_resources`),
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
    // >>> TO REMOVE >>>
    // Needed to demonstrate the current state of this page
    // Will be removed on next dev iteration
    const data = {
      identities: [],
      permissions: { allow: [{ action: '*' }] },
      resources: [
        { urn: 'urn:v1:eu:resource:cdn:28dd67c9-1817-4c02-a3ab-76e96324b603' },
      ],
      name: this.model.name,
    };
    // <<< TO REMOVE <<<

    this.createSnapshot();
    this.isSubmitting = true;

    return this.PolicyService.createPolicy(data)
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
   * Global error handler
   * @param {Error} error
   */
  onError(error) {
    const { message } = error.data ?? {};
    this.alert.error('iam_create_policy_error_creation', { message });
  }

  /**
   * Called back each time the resources have been loaded
   * @param {Object[]} data
   */
  onResourcesLoaded({ data: resources }) {
    if (this.hasSelectedResourceTypes && !resources.length) {
      this.createSnapshot();
      this.error.resourceTypes = {
        label: this.translations.noResources,
        silent: true,
      };
    } else {
      delete this.error.resourceTypes;
    }

    this.runValidation();
  }

  /**
   * Called back each time the resource types have changed
   * Change the resources url to trigger a new load
   */
  onResourceTypesChanged() {
    this.url.resources = [
      this.ResourceService.resourcesUrl,
      this.model.resourceTypes.map((item) => `resourceType=${item}`).join('&'),
    ].join('?');

    this.model.resources = this.model.resources?.filter(({ type }) =>
      this.model.resourceTypes.includes(type),
    );
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
}
