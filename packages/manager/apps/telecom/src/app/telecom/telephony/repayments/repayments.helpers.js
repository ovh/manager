export function transformRepayments(repayments) {
  return repayments.map((repayment) => {
    return {
      ...repayment,
      duration: moment.duration(repayment.duration).asSeconds(),
    };
  });
}

export default {
  transformRepayments,
};
