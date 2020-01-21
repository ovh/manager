import get from 'lodash/get';

export default /* @ngInject */ ($translate, $filter) => {
  const unitHash = {
    m: 'month',
    d: 'day',
    j: 'day',
    y: 'year',
    a: 'year',
  };
  const simpleDurationReg = /(^[0-9]+)([mdjya]?)$/;
  const upto = /^upto/;
  const uptoDuration = /(^upto-)([0-9]{4}-[0-9]{2}-[0-9]{2}?$)/;
  const engage = /(^engage)([0-9]+)([mdjya]?)$/;

  /*
   * options : {
   *   prorata : boolean (default: false) // display prorata text for 'upto' durations
   * }
   *
   */

  return (wucDuration, dateFormat, options) => {
    let d;
    let unit;

    if (simpleDurationReg.test(wucDuration)) {
      d = +wucDuration.match(simpleDurationReg)[1];
      unit = unitHash[wucDuration.match(simpleDurationReg)[2] || 'm'];
      return d > 1
        ? $translate.instant(`duration_${unit}_other`, {
            t0: d,
          })
        : $translate.instant(`duration_${unit}_1`);
    }
    if (upto.test(wucDuration)) {
      if (uptoDuration.test(wucDuration)) {
        [, , d] = wucDuration.match(uptoDuration);
        return $translate.instant(
          get(options, 'prorata') ? 'duration_upto_prorata' : 'duration_upto',
          {
            t0: dateFormat ? $filter('date')(d, dateFormat) : d,
          },
        );
      }
      return $translate.instant('duration_uptofirstdaynextmonth');
    }
    if (engage.test(wucDuration)) {
      d = +wucDuration.match(engage)[2];
      unit = unitHash[wucDuration.match(engage)[3] || 'm'];
      return $translate.instant('duration_engage', {
        t0:
          d > 1
            ? $translate.instant(`duration_${unit}_other`, {
                t0: d,
              })
            : $translate.instant(`duration_${unit}_1`),
      });
    }
    return wucDuration;
  };
};
