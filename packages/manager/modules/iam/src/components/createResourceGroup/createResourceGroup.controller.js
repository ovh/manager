import { cloneDeep, isEqual } from 'lodash-es';

import { ENTITY, ENTITY_NAME_PATTERN, TAG } from '../../iam.constants';
import {
  CREATE_RESOURCE_GROUP_TAG,
  CREATE_RESOURCE_GROUP_MAX_SIZE,
} from './createResourceGroup.constants';

export default class CreateResourceGroupController {
  /* @ngInject */
  constructor($q, $timeout, $translate, IAMService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.IAMService = IAMService;

    this.ENTITY_NAME_PATTERN = ENTITY_NAME_PATTERN;
    this.ENTITY_RESOURCE_TYPE = ENTITY.RESOURCE_TYPE;
    this.CREATE_RESOURCE_GROUP_MAX_SIZE = CREATE_RESOURCE_GROUP_MAX_SIZE;

    /**
     * The oui-select confirm-remove property works with promises
     * Associated entities to delete when the user wants to remove a resourceType
     * @type {Object}
     */
    this.deletion = null;

    /**
     * A set of parsed error classes returned by the api
     * Keys are resourceGroup property names and values are translated errors
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
      resources: { selection: [], types: [] },
    };

    /**
     * When the user submits the data, a snapshot of the model is created
     * If any error occures after the submission, it prevents the user from submitting the same data
     * @see {model}
     */
    this.modelSnapshot = null;

    // Can be passed as reference to a component
    this.onDeleteEntityGoBack = this.onDeleteEntityGoBack.bind(this);
  }

  /**
   * Whether the current controller's state allow the data to be submitted
   * @type {boolean}
   */
  get canSubmit() {
    return (
      !this.isSubmitting && this.form?.$valid && !this.resourceGroup?.readOnly
    );
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
   * Whether the user has selected at least one resource type
   * @returns {boolean}
   */
  get hasSelectedResourceTypes() {
    return this.model.resourceTypes?.length > 0;
  }

  /**
   * The Current controller's mode. If any resourceGroup is given, it is edition mode
   * Otherwise, it is creation mode
   * @returns {'create'|'edit'}
   */
  get mode() {
    return this.resourceGroup ? 'edit' : 'create';
  }

  /**
   * A contextualized Set where each key map to a tag
   * @returns {import('./createResourceGroup.constants').CreateResourceGroupTag|null}
   */
  get tag() {
    return CREATE_RESOURCE_GROUP_TAG[this.mode] ?? null;
  }

  /**
   * A contextualized Set where each key map to a translation
   * @returns {Object<string,string>}
   */
  get translations() {
    const prefix = 'iam_create_resource_group';
    const { mode } = this;
    return {
      error: `${prefix}_error_${mode}`,
      errorHeading: `${prefix}_error_heading_${mode}`,
      formHeading: {
        name: `${prefix}_form_name_heading`,
        resources: `${prefix}_form_resources_heading`,
        resourceTypes: `${prefix}_form_resource_types_heading`,
      },
      header: `${prefix}_header_heading_${mode}`,
      submit: `${prefix}_submit_${mode}`,
      success: `${prefix}_success_${mode}`,
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
      this.model.name = this.resourceGroup.name;
      this.model.resources.selection = [...this.resourceGroup.resources];
      this.model.resources.types = this.model.resources.selection
        .map(({ type }) => type)
        .filter(
          (resourceType, index, list) =>
            Boolean(resourceType) && list.indexOf(resourceType) === index,
        );
    }
  }

  /**
   * Cancel the resourceGroup creation by going back to the previous state
   * @returns {Promise}
   */
  cancelCreation() {
    this.trackClick(this.tag?.cancel);
    return this.goTo({
      name: 'iam.policies.resourceGroups',
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
  onDeleteEntityGoBack({ success }) {
    this.deletion.promise
      .then(() =>
        this.$timeout(() => {
          const {
            data: { resources: deletedResources },
          } = this.deletion;

          if (success) {
            this.model.resources = {
              ...this.model.resources,
              selection:
                this.model.resources.selection?.filter(
                  ({ id }) =>
                    !deletedResources.find((resource) => id === resource.id),
                ) || [],
            };
          }
        }),
      )
      .finally(() => {
        this.deletion = null;
      });

    this.deletion.resolve(success);
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
   * Called back when a guide menu item is clicked
   * @param {string} guideKey
   */
  onGuideClick(guideKey) {
    this.trackClick(TAG.GUIDE(guideKey));
  }

  /**
   * Called back each time a resource types is about to be deleted
   * If a deletion is detected, ask the user for a confirmation
   * @param {string} resourceType The resource type to delete
   */
  onResourceTypesConfirmRemove(resourceType) {
    const resources = this.model.resources.selection?.filter(
      (resource) => resource.type === resourceType,
    );

    this.trackClick(this.tag?.removeResourceType);

    if (resources?.length) {
      this.deletion = this.$q.defer();
      this.deletion.data = { name: resourceType, resources };
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
        ? this.IAMService.setResourceGroup(this.resourceGroup.id, this.toAPI())
        : this.IAMService.createResourceGroup(this.toAPI());

    this.trackClick(this.tag?.submit);

    return promise
      .then(() => {
        this.error = {};
        return this.goTo({
          name: 'iam.policies.resourceGroups',
          reload: true,
          success: {
            key: this.translations.success,
            values: { name: `<strong>${this.model.name}</strong>` },
          },
          tag: this.tag?.submitSuccess,
        });
      })
      .catch((error) => {
        this.isSubmitting = false;

        this.trackPage(this.tag?.submitError);

        if (error.data.resourceGroup) {
          this.error = error.data.resourceGroup;
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
   * @see {IAMService#createResourceGroup}
   * @returns {Object}
   */
  toAPI() {
    return {
      name: this.model.name,
      resources: this.model.resources.selection.map(({ id }) => ({ id })),
    };
  }
}
