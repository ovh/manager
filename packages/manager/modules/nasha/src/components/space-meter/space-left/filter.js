import template from 'lodash/template';

export default /* @ngInject */ ($translate) => {
  const tpl =
    '<%= used.value %> <%= $t.instant(used.unit) %>' +
    ' / <%= total.value %> <%= $t.instant(total.unit) %> ' +
    '(<%= ratio %>%)';
  return function filter(usage) {
    const ratio = Number.isFinite((usage.used.value * 100) / usage.size.value)
      ? parseFloat((usage.used.value * 100) / usage.size.value, 10).toFixed(2)
      : 0;

    return template(tpl)({
      $t: $translate,
      total: usage.size,
      used: usage.used,
      ratio,
    });
  };
};
