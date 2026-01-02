import template from 'lodash/template';

export default /* @ngInject */ ($translate) => {
  const tpl =
    '<%= totalUsed.value %> <%= $t.instant(totalUsed.unit) %>' +
    ' / <%= total.value %> <%= $t.instant(total.unit) %> ' +
    '(<%= ratio %>%)';
  return function filter(usage) {
    return template(tpl)({
      $t: $translate,
      total: usage.size,
      totalUsed: usage.totalUsed,
      ratio: parseFloat(
        (usage.totalUsed.value * 100) / usage.size.value,
      ).toFixed(2),
    });
  };
};
