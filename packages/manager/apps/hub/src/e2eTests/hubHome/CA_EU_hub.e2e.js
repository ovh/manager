import config from '../../../../../tools/testcafe/config';
import {
  userRole,
  userRoleDisconnect,
} from '../../../../../tools/testcafe/roles';
import HubPage from '../../../../../tools/testcafe/pages/hub/hubPage';

const user = userRole(config);

fixture('check hub page')
  .meta({
    service: ['ovh.com-manager', 'ca.ovh.com-manager'],
    type: 'regression',
    severity: 'critical',
    priority: 'high',
    scope: 'hub',
  })
  .page(config.baseUrl)
  .beforeEach(async (t) => {
    await t.useRole(user);
  });

// The product must be in automatic renewal
test(`confirm ${config.dataset.hubProduct} dropdown actions urls`, async () => {
  const hubPage = new HubPage();
  await hubPage.confirmCurrentPage();
  await hubPage.dropdownProductAutomaticRenew(config.dataset.hubProduct);
}).after(async () => {
  await userRoleDisconnect(config);
});
