import { DELETE_STATEMENT, ENTITY } from '@iam/constants';

export default class DeleteEntityController {
  /* @ngInject */
  constructor($q, PolicyService) {
    this.$q = $q;
    this.PolicyService = PolicyService;

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
   * Delete the entity
   * @returns {Promise}
   */
  delete() {
    let promise;

    if (this.entity.type === ENTITY.POLICY) {
      promise = this.deletePolicy();
    } else {
      promise = this.$q.reject({ data: { message: 'Unknown entity type' } });
    }

    promise
      .then(() =>
        this.goBack({ success: this.translate.success, reload: true }),
      )
      .catch((error) => {
        const { message } = error.data ?? {};
        return this.goBack({
          error: { key: this.translate.error, values: { message } },
        });
      });

    this.isDeleting = true;

    return promise;
  }

  /**
   * Delete the entity using the PolicyService
   * @returns {Promise}
   */
  deletePolicy() {
    return this.PolicyService.deletePolicy(this.entity.data.id);
  }
}
