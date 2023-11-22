import { TRACKING_HIT_PREFIX } from '../../list/delete/constants';

export const deletePoolResolve = {
  breadcrumb: () => null,
  poolId: /* @ngInject */ ($transition$) => $transition$.params().poolId,
  poolName: /* @ngInject */ ($transition$) => $transition$.params().poolName,
  trackDeleteAction: /* @ngInject */ (trackAction) => (hit) =>
    trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
  trackDeletePage: /* @ngInject */ (trackPage) => (hit) =>
    trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
};

export default { deletePoolResolve };
