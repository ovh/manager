export default class PlanFamily {
  constructor({ name, plans, selectedPlan }) {
    Object.assign(this, {
      name,
      plans,
      selectedPlan,
    });
  }
}
