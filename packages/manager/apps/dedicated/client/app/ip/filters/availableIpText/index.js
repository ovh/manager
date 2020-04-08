export default /* @ngInject */ ($translate) =>
  function availableIpTextFilter(ip) {
    if (!ip.blockSizes.length) {
      return '';
    }

    let html = '';
    if (ip.blockSizes.length > 1) {
      html += $translate.instant('ip_order_step1_DEDICATED_v2_pre', {
        t0: ip.number,
      });
      html += ' ';
      html += $translate.instant('ip_order_step1_DEDICATED_minmax', {
        t0: Math.min.apply(null, ip.blockSizes),
        t1: Math.max.apply(null, ip.blockSizes),
      });
    } else {
      html +=
        ip.number > 1
          ? $translate.instant('ip_order_step1_DEDICATED_v2_individual_other', {
              t0: ip.number,
            })
          : $translate.instant('ip_order_step1_DEDICATED_v2_individual_1');
      if (ip.blockSizes[0] !== 1) {
        html += ` ${$translate.instant(
          'ip_order_step1_DEDICATED_individualblocksize',
          {
            t0: ip.blockSizes[0],
          },
        )}`;
      }
    }

    return html;
  };
