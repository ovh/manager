import punycode from 'punycode';
import { cloneDeep } from 'lodash-es';

import { URL } from '../../iam.service';

export default class ResourceSelectController {
  /* @ngInject */
  constructor($filter, $timeout, $transclude, $translate) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;

    this.URL = URL;

    /**
     * The NgFormController created by the template by using name="$ctrl.form"
     * @type {NgFormController}
     */
    this.form = null;

    /**
     * Whether the resource sibling slot is filled
     * Used to fix a layout issue
     * @type {Boolean}
     */
    this.hasResourcesSiblingSlot = $transclude.isSlotFilled(
      'resourcesSiblingSlot',
    );

    /**
     * The form's data model
     * @type {Object}
     */
    this.model = {
      selection: [],
      types: [],
    };

    /**
     * Resources loaded from the api when resourceTypes have changed
     * @type {Object[]}
     */
    this.resources = null;

    /**
     * Keep a copy of the resource url
     * This url will change each time resource types changed
     * @type {string}
     */
    this.resourceUrl = URL.RESOURCE;
  }

  /**
   * Whether the selected resourceType has associated resources
   * @returns {boolean}
   */
  get hasNoAssociatedResources() {
    return this.resources !== null && this.resources.length === 0;
  }

  /**
   * Whether the user has selected at least one resource type
   * @returns {boolean}
   */
  get hasSelectedResourceTypes() {
    const { model, resourceTypesControl } = this;
    return (
      model.types?.length > 0 ||
      resourceTypesControl?.$$rawModelValue?.length > 0 ||
      false
    );
  }

  /**
   * Whether the resources select is disabled
   * @returns {boolean}
   */
  get isResourcesDisabled() {
    return !this.resources || !this.resources.length || this.readOnly;
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
      this.required && (!this.model.types || this.model.types.length === 0)
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

  $onInit() {
    this.computeURLResource();
  }

  computeURLResource() {
    if (this.hasSelectedResourceTypes) {
      this.resourceUrl = [
        URL.RESOURCE,
        this.model.types.map((type) => `resourceType=${type.value}`).join('&'),
      ].join('?');
    }
  }

  $onChanges({ ngModel, required }) {
    if (ngModel) {
      this.model = cloneDeep(ngModel.currentValue);
      if (this.model.types?.length) {
        this.transformResourceTypes(this.model.types);
      }
    }

    if (!required) {
      return;
    }
    // Wait for this.form to be attached
    // Can't use $postLink because oui-select are not attached at this time
    this.$timeout(() => {
      const { resourceTypesControl } = this;
      if (required?.currentValue) {
        // Error when a resourceType is selected with no associated resources
        resourceTypesControl.$validators.resources = () =>
          !this.hasNoAssociatedResources;
      } else {
        delete resourceTypesControl.$validators.resources;
      }
    });
  }

  /**
   * Set the required ngModel instance's value each time the model has changed
   * The ngModel is of type { selection: Object[], types: string[] }
   */
  onModelChanged() {
    this.requiredNgModel.$setViewValue({
      selection: this.model.selection,
      types: this.resourceTypesControl.$$rawModelValue?.map(
        ({ value }) => value,
      ),
    });
  }

  /**
   * Called back each time the resources have changed
   * @param {Object} value
   */
  onResourcesChanged(value) {
    this.form[this.resourcesName].$setValidity(
      'limit',
      this.model.selection.length <= Number(this.maxLength),
    );
    if (this.onChange) {
      this.onModelChanged();
      this.onChange({ change: { type: 'resources', value } });
    }
  }

  /**
   * Called back each time the resources have been loaded
   * @param {Object[]} resources
   */
  onResourcesLoaded({ data: resources }) {
    // Some resources could be encoded using punycode scheme
    resources.forEach((resource) => {
      Object.assign(resource, {
        displayName: punycode.toUnicode(resource.displayName),
      });
    });

    // Restore references to the model
    // /!\ Avoid having the same selected item twice
    if (this.model.selection?.length) {
      this.model.selection = this.model.selection.map(
        (resource) =>
          resources.find(({ id }) => resource.id === id) || resource,
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
      this.onModelChanged();
      this.onChange({ change: { type: 'resourceTypes', value } });
    }
    this.computeURLResource();
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

  /**
   * Post-process the list (translations, sorting, ...)
   * @param {Array} resourceTypes
   */
  transformResourceTypes(resourceTypes) {
    const resourceTypeFilter = this.$filter('iamResourceType');
    resourceTypes.forEach((resourceType, i) => {
      Object.assign(resourceTypes, {
        [i]: {
          label: resourceTypeFilter(resourceType),
          value: resourceTypes[i],
        },
      });
    });
    resourceTypes.sort(({ label: labelA }, { label: labelB }) =>
      labelA.toLowerCase() > labelB.toLowerCase() ? 1 : -1,
    );
  }
}
