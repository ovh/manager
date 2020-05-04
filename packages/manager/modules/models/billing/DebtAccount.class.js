import get from 'lodash/get';

/**
 * Describe a debt account
 * Debt account represent the total debt owed by a nichandle
 */
export default class DebtAccount {
  /**
   *
   * @param {Object} debtAccount
   * @param {Boolean=} debtAccount.active true if there is an existing debt
   * @param {Object} debtAccount.todoAmount object representing amount that is awayting payment
   * @param {Object} debtAccount.dueAmount object representing amount that is still due
   */
  constructor({ active, dueAmount, todoAmount }) {
    Object.assign(this, {
      active,
      todoAmount,
      dueAmount,
    });
  }

  /**
   * @returns {Boolean} true if there is an existing debt
   */
  isActive() {
    return (
      this.active &&
      (get(this.todoAmount, 'value', 0) > 0 ||
        get(this.dueAmount, 'value', 0) > 0)
    );
  }
}
