export default class ResourceSelectController {
  /* @ngInject */
  constructor(
    $scope,
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
     * The NgFormController created by the template by using name="$ctrl.form"
     * @type {NgFormController}
     */
    this.form = null;

    /**
     * Resources loaded from the api when resourceTypes have changed
     * @type {Object[]}
     */
    this.resources = null;

    /**
     * Urls for the oui-select load options
     * @type {Object<string,string>}
     */
    this.url = {
      resources: ResourceService.resourcesUrl,
      resourceTypes: ReferenceService.resourceTypesUrl,
    };

    // Two way bound properties do no trigger $onChanges events
    $scope.$watch(
      () => this.resourceTypesModel,
      (value) => value && this.onResourceTypesChanged(),
      true,
    );
  }

  /**
   * Returns the resourceTypes form control
   * E.g. instance of NgModelController
   * @returns {Object?}
   */
  get resourceTypesControl() {
    return this.form?.[this.resourceTypesName];
  }

  /**
   * Whether the user has selected at least one resource type
   * @returns {boolean}
   */
  get hasSelectedResourceTypes() {
    return this.resourceTypesModel?.length > 0 || false;
  }

  /**
   * Whether the resources select is disabled
   * @returns {boolean}
   */
  get isResourcesDisabled() {
    return !this.resources || !this.resources.length;
  }

  /**
   * Whether the resources select is required
   * @returns {boolean}
   */
  get isResourcesRequired() {
    return this.required && !this.isResourceTypesRequired;
  }

  /**
   * Whether the resource types select is required
   * @returns {boolean}
   */
  get isResourceTypesRequired() {
    return (
      this.required &&
      (!this.resourceTypesModel || this.resourceTypesModel.length === 0)
    );
  }

  $onInit() {
    // Wait for this.form to be attached
    // Can't use $postLink because oui-select are not attached at this time
    this.$timeout(() => {
      // Error when a resourceType is selected with no associated resources
      this.resourceTypesControl.$validators.resources = () =>
        this.resources === null || this.resources?.length > 0;
    });
  }

  /**
   * Called back each time the resources have changed
   * @param {Object} value
   */
  onResourcesChanged(value) {
    if (this.onChange) {
      this.onChange({ change: { type: 'resources', value } });
    }
  }

  /**
   * Called back each time the resources have been loaded
   * @param {Object[]} resources
   */
  onResourcesLoaded({ data: resources }) {
    // Restore references to the model
    // /!\ Avoid having the same selected item twice
    if (this.resourcesModel?.length) {
      this.resourcesModel = this.resourcesModel.map(
        (resource) =>
          resources.find(({ id }) => resource.id === id) ?? resource,
      );
    }
    this.resources = resources;
    this.runValidation();
  }

  /**
   * Called back each time the resource types have changed
   * Change the resources url to trigger a new load
   * @param {string|Array|undefined} value
   */
  onResourceTypesChanged(value) {
    if (value && this.onChange) {
      this.onChange({ change: { type: 'resourceTypes', value } });
    }
    if (this.hasSelectedResourceTypes) {
      this.url.resources = [
        this.ResourceService.resourcesUrl,
        this.resourceTypesModel.map((item) => `resourceType=${item}`).join('&'),
      ].join('?');
    }
    this.resources = null;
    this.runValidation();
  }

  /**
   * Because we attach custom validation to the form's controls
   * We need a way to validate it on demand
   */
  runValidation() {
    // Gives time to the error-messages attributes to react
    this.$timeout(() => {
      this.resourceTypesControl.$setDirty();
      this.resourceTypesControl.$validate();
    });
  }
}
