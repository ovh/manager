/**
 * Contains resolve object that allows to handle a cursor paginated datagrid with url params
 * @cursors: retrieve cursors information from params
 * @trackClick: At internet trackclick implementation
 * @trackPage: At internet trackpage implementation
 * @alert: ovh Alerter implementation
 * */
export const stateResolves = {
  goTo: /* @ngInject */ ($state) => ({ name, params }) =>
    $state.go(name, params),
  cursors: /* @ngInject */ ($transition$) => {
    return $transition$.params().cursors;
  },
  /**
   * Track a click action using the AT Internet provider
   * @returns {void}
   */
  trackClick: /* @ngInject */ (atInternet) => (name) => {
    atInternet.trackClick({ name, type: 'action' });
  },

  /**
   * Track a page using the AT Internet provider
   * @returns {void}
   */
  trackPage: /* @ngInject */ (atInternet) => (name) => {
    atInternet.trackPage({ name });
  },

  alert: /* @ngInject */ ($translate, Alerter) => ({
    success: (key, values) =>
      Alerter.success(
        $translate.instant(key, values),
        `cursor-datagrid-alert-id`,
      ),
    error: (key, values) =>
      Alerter.error(
        $translate.instant(key, values),
        `cursor-datagrid-alert-id`,
      ),
  }),
};

export const stateParams = {
  cursors: {
    array: false,
    dynamic: true,
    inherit: false,
    squash: true,
    type: 'cursors',
    value: null,
  },
};

const resolveKeys = Object.keys(stateResolves);
export const componentBindings = {};
resolveKeys.forEach((key) => {
  componentBindings[key] = '<';
});

export default {
  stateResolves,
  stateParams,
  componentBindings,
};
