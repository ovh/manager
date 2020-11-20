import { userRole } from '../../../../tools/testcafe/roles';
import navbar from '../../../../tools/testcafe/pages/manager/components/navbar';
import config from '../../../../tools/testcafe/config';

fixture('Just a simple test')
  .meta({
    service: ['ovh.com-manager'],
    type: 'regression',
    severity: 'critical',
    priority: 'high',
    scope: 'hub/dashboard',
  })
  .page(config.baseUrl)
  .beforeEach(async (t) => {
    await t.useRole(userRole(config));
  });

test('it should access to Manager Hub', async (t) => {
  await t.expect(navbar.navbar.exists).ok();
});
