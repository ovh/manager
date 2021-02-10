import template from 'lodash/template';

export default /* @ngInject */ ($translate) => {
  const tpl =
    "<%= used.value %> <%= $t.instant('unit_size_' + used.unit) %>" +
    " / <%= total.value %> <%= $t.instant('unit_size_' + total.unit) %> " +
    '(<%= ratio %>%)';
  return function filter(usage) {
    return template(tpl)({
      $t: $translate,
      total: usage.size,
      used: usage.used,
      ratio: parseFloat((usage.used.value * 100) / usage.size.value).toFixed(2),
    });
  };
};
