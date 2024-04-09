import { DELETE_STATEMENT, ENTITY } from '../../iam.constants';
import { DELETE_ENTITY_TAG } from './deleteEntity.constants';

export default class DeleteEntityController {
  /* @ngInject */
  constructor($q, $stateParams, IAMService) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.IAMService = IAMService;

    this.DELETE_STATEMENT = DELETE_STATEMENT;

    /**
     * Whether the controller is currently deleting the entity
     * @type {boolean}
     */
    this.isDeleting = false;

    /**
     * The statement field's ng-model, needed to activate the form validation
     * @type {string}
     */
    this.model = '';

    /**
     * The pattern the user must type in the statement field to delete the entity
     * @type {RegExp}
     */
    this.pattern = new RegExp(`^${DELETE_STATEMENT}$`);
  }

  /**
   * Whether the controller can delete the entity
   * @returns {boolean}
   */
  get canDelete() {
    return !this.isDeleting && this.form?.$valid;
  }

  /**
   * A contextualized Set where each key map to a tag
   * @returns {import('./deleteEntity.constants').DeleteEntityTag|null}
   */
  get tag() {
    return DELETE_ENTITY_TAG[this.entity.type] ?? null;
  }

  /**
   * A contextualized Set where each key map to a translation
   * @returns {{
   *   field: string,
   *   error: string,
   *   heading: string,
   *   name: string,
   *   success: string,
   *   warn: string,
   * }}
   */
  get translate() {
    return {
      field: `iam_delete_entity_${this.entity.type}_field`,
      error: `iam_delete_entity_${this.entity.type}_error`,
      heading: `iam_delete_entity_${this.entity.type}_heading`,
      name: `iam_delete_entity_${this.entity.type}_name`,
      success: `iam_delete_entity_${this.entity.type}_success`,
      warn: `iam_delete_entity_${this.entity.type}_warn`,
    };
  }

  /**
   * Close the current modal
   * @returns {Promise}
   */
  close() {
    this.trackDeleteEntityClick('close');
    return this.goBack({ params: this.$stateParams });
  }

  /**
   * Delete the entity
   * @returns {Promise}
   */
  delete() {
    let promise;

    if (this.entity.type === ENTITY.POLICY) {
      promise = this.deletePolicy();
    } else if (this.entity.type === ENTITY.RESOURCE_GROUP) {
      promise = this.deleteResourceGroup();
    } else if (this.entity.type === ENTITY.RESOURCE_TYPE) {
      promise = this.$q.when(true);
    } else {
      promise = this.$q.reject({ data: { message: 'Unknown entity type' } });
    }

    this.trackDeleteEntityClick('delete');

    promise
      .then(() =>
        this.goBack({
          reload: true,
          success: this.translate.success,
          ...(this.tag?.success && { tag: this.tag.success }),
        }),
      )
      .catch((error) => {
        const { message } = error.data ?? {};
        return this.goBack({
          error: {
            key: this.translate.error,
            values: { message },
          },
          ...(this.tag?.error && { tag: this.tag.error }),
        });
      });

    this.isDeleting = true;

    return promise;
  }

  /**
   * Delete the entity using the IAMService
   * @returns {Promise}
   */
  deletePolicy() {
    return this.IAMService.deletePolicy(this.entity.data.id);
  }

  /**
   * Delete the entity using the IAMService
   * @returns {Promise}
   */
  deleteResourceGroup() {
    return this.IAMService.deleteResourceGroup(this.entity.data.id);
  }

  /**
   * Custom trackClick wrapper witch uses the tagPrefix bound property
   * @param {'close'|'delete'} tagKey
   */
  trackDeleteEntityClick(tagKey) {
    const tag = this.tag?.[tagKey];
    if (tag) {
      this.trackClick([this.tagPrefix, tag].filter(Boolean).join('::'));
    }
  }
}
