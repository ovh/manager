import { vitest, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { BaseLayout } from '..';
import { GuideMenu, GuideMenuItem } from '../../guide-menu';
import { ChangelogMenu, ChangelogMenuLinks } from '../../changelog-menu';
import { Breadcrumb } from '../../breadcrumb';
import { TabsComponent } from '../../tabs';
import { Notifications } from '../../notifications';

vitest.mock('react-router-dom', async () => ({
  ...(await vitest.importActual('react-router-dom')),
  useLocation: () => ({
    pathname: '/foo',
  }),
}));

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

vitest.mock('@ovh-ux/manager-react-shell-client', async (importActual) => ({
  ...(await importActual()),
  useOvhTracking: () => ({
    trackClick: vitest.fn(),
  }),
}));

const guideMenu = (
  <GuideMenu
    items={
      [
        {
          id: 1,
          href: 'https://www.ovhcloud.com/',
          children: 'Guide Menu Item Label',
        },
      ] as GuideMenuItem[]
    }
  />
);

const ChangelogMenuComponent = (
  <ChangelogMenu
    links={
      {
        changelog: '',
        roadmap: '',
        'feature-request': '',
      } as ChangelogMenuLinks
    }
  />
);

const breadcrumb = <Breadcrumb appName="Test-App" rootLabel="Test App" />;

const tabs = <TabsComponent items={['tab1', 'tab2']} />;

const message = <Notifications />;

const renderBaseLayout = ({ children, ...rest }) =>
  render(<BaseLayout {...rest}>{children}</BaseLayout>);

describe('BaseLayout component - Snapshot tests', () => {
  it('renders the complete Base Layout', () => {
    const { container } = renderBaseLayout({
      children: <main>Main Content of the Page.</main>,
      header: {
        title: 'Title of the page',
        guideMenu,
        ChangelogMenuComponent,
      },
      breadcrumb,
      tabs,
      backLink: {
        label: 'back Link Label',
        onClick: vitest.fn(),
      },
      description: 'Sample description of the page.',
      message,
      subtitle: 'Sample Sub-title of the page',
    });
    expect(container).toMatchSnapshot();
  });
});
