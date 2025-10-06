import IAMConditionsUtils from '../../../utils/conditions.utils';

export default class IAMConditionListController {
  $onInit() {
    this.condition = null;
    this.closeModal();

    this.pagination = {
      currentPage: 1,
      pageSize: 5,
      offset: null,
    };
  }

  openModal(condition) {
    this.condition = condition;
    this.modalOpen = true;
  }

  onConfirm = (condition) => {
    const decodedCondition = IAMConditionsUtils.decodeConditionValues(
      condition.values,
      this.conditions.length + 1,
    );
    if (condition.id) {
      const existingCondition = this.conditions.find(
        ({ id }) => id === condition.id,
      );
      Object.assign(existingCondition, decodedCondition);
    } else {
      this.conditions.push(decodedCondition);
    }
    this.closeModal();
  };

  onPageChange = ({ offset }) => {
    const { pageSize } = this.pagination;
    this.pagination.offset = offset;
    this.pagination.currentPage = Math.ceil(offset / pageSize);
  };

  checkPaginationOnDeletion = (nbItems) => {
    const { offset, pageSize } = this.pagination;
    if (offset === null || pageSize === null) {
      return;
    }

    const currentPage = Math.ceil(offset / pageSize);
    const maxNbPages = Math.ceil(nbItems / pageSize);
    if (currentPage > maxNbPages) {
      this.pagination.currentPage = maxNbPages;
      this.pagination.offset = (maxNbPages - 1) * pageSize + 1;
    }
  };

  closeModal() {
    this.modalOpen = false;
  }

  removeCondition(condition) {
    this.conditions.splice(
      this.conditions.findIndex(({ id }) => id === condition.id),
      1,
    );
    this.checkPaginationOnDeletion(this.conditions.length);
  }

  editCondition(condition) {
    this.openModal(condition);
  }
}
