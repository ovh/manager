import find from 'lodash/find';
import get from 'lodash/get';
import trimStart from 'lodash/trimStart';

import { MIGRATION_STATUS, STEP_STATES, STEP_TYPES } from './constants';

export default class {
  constructor({ from, id, status, steps, to }) {
    Object.assign(this, { from, id, status, steps, to });
  }

  hasOrderPending() {
    const order = find(this.steps, (step) => step.name === STEP_TYPES.ORDERS);
    return order.status !== STEP_STATES.OK;
  }

  hasDebtPending() {
    const debt = find(this.steps, (step) => step.name === STEP_TYPES.DEBT);
    return debt.status !== STEP_STATES.OK;
  }

  getPendingDebt() {
    const debt = find(this.steps, (step) => step.name === STEP_TYPES.DEBT);
    const debtStr =
      get(debt, 'debt.balanceAmount.value') !== 0
        ? get(debt, 'debt.balanceAmount.text')
        : get(debt, 'debt.ovhAccountAmount.text');
    return trimStart(debtStr, '-');
  }

  hasNicPending() {
    const nic = find(this.steps, (step) => step.name === STEP_TYPES.NIC);
    return nic.status !== STEP_STATES.OK;
  }

  hasContractsPending() {
    const contracts = find(
      this.steps,
      (step) => step.name === STEP_TYPES.CONTRACTS,
    );
    return contracts.status !== STEP_STATES.OK;
  }

  hasOnlyContractsPending() {
    return (
      this.hasContractsPending() &&
      !(this.hasOrderPending() || this.hasDebtPending() || this.hasNicPending())
    );
  }

  isPending() {
    return this.status === MIGRATION_STATUS.TODO;
  }
}
