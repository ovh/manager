export function formatRepayments(repayments) {
  return repayments.map((repayment) => ({
    ...repayment,
    duration: moment.duration(repayment.duration).asSeconds(),
  }));
}

export function calculateTotalRepayments(repayments) {
  return repayments.reduce(
    (totalRepayments, { buyAmount: { value: repayment } }) =>
      totalRepayments + repayment,
    0,
  );
}
