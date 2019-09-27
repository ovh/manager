import find from 'lodash/find';

export default /* @ngInject */ function (TUC_TELEPHONY_NUMBER_PLANS) {
  this.getPlanByNumber = function getPlanByNumber(number) {
    let prefixedNumber;
    let foundedPlan;

    if (number) {
      prefixedNumber = number.serviceName.replace(/^00/, '+');
      foundedPlan = find(TUC_TELEPHONY_NUMBER_PLANS, (plan) => {
        const founded = prefixedNumber.indexOf(plan.prefix) === 0;
        return founded;
      });
    }

    return foundedPlan;
  };
}
