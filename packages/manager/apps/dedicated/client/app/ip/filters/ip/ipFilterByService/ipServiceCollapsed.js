export default () =>
  function ipFilterByServiceFilter(dataset, services, filter) {
    if (!filter) {
      return dataset;
    }

    const datasetReturned = {};

    switch (filter) {
      case 'ALL':
        return dataset;
      case 'ALERTS':
        angular.forEach(dataset, (sVal, sName) => {
          if (
            services[sName] &&
            (services[sName].alerts.mitigation.length ||
              services[sName].alerts.spam.length)
          ) {
            datasetReturned[sName] = sVal;
          }
        });
        break;
      default:
        angular.forEach(dataset, (sVal, sName) => {
          if (
            services[sName] &&
            services[sName].serviceType &&
            services[sName].serviceType === filter
          ) {
            datasetReturned[sName] = sVal;
          }
        });
    }
    return datasetReturned;
  };
