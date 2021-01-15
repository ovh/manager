import config from '../../../../../tools/testcafe/config';
import {
  userRole,
  userRoleDisconnect,
} from '../../../../../tools/testcafe/roles';
import navbar from '../../../../../tools/testcafe/pages/components/navbar';
import HubPage from '../../../../../tools/testcafe/pages/hub/hubPage';
import ServersListDashboard from '../../../../../tools/testcafe/pages/hub/dedicatedServerDashboard';

const user = userRole(config);

fixture('check hub page')
  .meta({
    service: [
      'ovh.com-manager',
      'ca.ovh.com-manager',
      'us.ovhcloud.com-manager',
    ],
    type: 'regression',
    severity: 'critical',
    priority: 'high',
    scope: 'hub',
  })
  .page(config.baseUrl)
  .beforeEach(async (t) => {
    await t.useRole(user);
  });

test('it should access to Manager Hub', async (t) => {
  await t.expect(navbar.navbar.exists).ok();
});

test('confirm link to all orders list', async () => {
  const hubPage = new HubPage();
  await hubPage.confirmCurrentPage();
  await hubPage.confirmOrdersListLink();
});

test('go to dedicated server dashboard', async () => {
  const hubPage = new HubPage();
  const serversListDashboard = new ServersListDashboard();
  await hubPage.confirmCurrentPage();
  await HubPage.accessProductListDashboard('DEDICATED_SERVER');
  await serversListDashboard.confirmCurrentPage();
});

test('confirm link to last month bills', async () => {
  const hubPage = new HubPage();
  await hubPage.confirmCurrentPage();
  await hubPage.confirmBillsLink();
});

test('disconnect from manager', async () => {
  const hubPage = new HubPage();
  await hubPage.disconnectFromManager();
}).after(async () => {
  await userRoleDisconnect(config);
});
