import { describe, expect, it, vi } from 'vitest';

import { renderBaseLayout } from '@/commons/tests-utils/Render.utils';
import { changelogLinks, guideMenuItems } from '@/commons/tests-utils/StaticData.constants';
import { Breadcrumb, ChangelogMenu, GuideMenu, Notifications, TabsComponent } from '@/components';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: () => ({ pathname: '/foo' }),
}));

vi.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vi.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importActual) => ({
  ...(await importActual()),
  useOvhTracking: () => ({ trackClick: vi.fn() }),
}));

const guideMenu = <GuideMenu items={guideMenuItems} />;
const changelogMenu = <ChangelogMenu links={changelogLinks} />;
const breadcrumb = <Breadcrumb appName="Test-App" rootLabel="Test App" />;
const tabs = <TabsComponent items={['tab1', 'tab2']} />;
const message = <Notifications />;

describe('BaseLayout - Snapshot Tests', () => {
  it('renders complete layout with all props', () => {
    const { container } = renderBaseLayout({
      children: <main>Main Content of the Page.</main>,
      header: {
        title: 'Title of the page',
        guideMenu,
        changelogMenu,
      },
      breadcrumb,
      tabs,
      backLink: {
        label: 'Back Link Label',
        onClick: vi.fn(),
      },
      description: 'Sample description of the page.',
      message,
      subtitle: 'Sample Sub-title of the page',
    });

    expect(container).toMatchSnapshot('base-layout-full');
  });
});
