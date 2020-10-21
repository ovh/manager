export default /* @ngInject */ ($translate) => (period) => {
  switch (period) {
    case 1:
      return $translate.instant('autorenew_service_renew_month');
    case 12:
      return $translate.instant('autorenew_service_renew_year');
    default:
      if (period > 12) {
        if (period % 12 !== 0) {
          throw new RangeError(
            `renewFrequence: the period parameter (${period}) should represent a year in months, thus should be a multiple of 12`,
          );
        }

        return $translate.instant(
          'autorenew_service_renew_years_frequency_value',
          { t0: period / 12 },
        );
      }

      return $translate.instant('autorenew_service_renew_frequency_value', {
        t0: period,
      });
  }
};
