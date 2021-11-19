export function isStatusAllowed(status) {
  const allowedStatus = ['CREATED', 'PAID'];

  return allowedStatus.indexOf(status) > -1;
}

export function statusBadge(status) {
  const badgeColor = status === 'PAID' ? 'success' : 'error';

  return isStatusAllowed(status) ? badgeColor : '';
}

export function formatRepayments(repayments) {
  return repayments
    .filter((repayment) => isStatusAllowed(repayment.status))
    .map((repayment) => {
      return {
        ...repayment,
        duration: moment.duration(repayment.duration).asSeconds(),
      };
    });
}

export function calculateTotalRepayments(repayments) {
  return repayments.reduce(
    (totalRepayments, { buyAmount: { value: repayment } }) =>
      totalRepayments + repayment,
    0,
  );
}
