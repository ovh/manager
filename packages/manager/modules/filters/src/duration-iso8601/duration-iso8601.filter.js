export default /* @ngInject */ ($translate) => {
  const unitHash = {
    Y: 'year',
    M: 'month',
    W: 'week',
    D: 'day',
  };

  const RX_DURATION = /^P([1-12])([YMWD])$/;
  return (durationISO8601) => {
    const matches = RX_DURATION.exec(durationISO8601);
    if (matches) {
      return $translate.instant(`duration_${unitHash[matches[2]]}`, {
        duration: matches[1],
      });
    }
    return durationISO8601;
  };
};
