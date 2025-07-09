import { vitest, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Headers } from '../Headers.component';
import { IamAuthorizationResponse } from '../../../../../hooks/iam/iam.interface';
import { useAuthorizationIam } from '../../../../../hooks/iam';
import { ActionMenu, ChangelogButton } from '../../../../navigation';
import { GuideMenu } from '../../../../guide-menu';

vitest.mock('../../../../../hooks/iam');

vi.mock('../../../../../hooks/iam', () => ({
  useAuthorizationIam: vi.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

vitest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({
    trackClick: vi.fn(),
  }),
}));

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

const header = () => <Headers title="Example for header" />;

const headerWithHeaderButtons = () => (
  <Headers
    title="Example for header with header buttons"
    GuideMenu={
      <GuideMenu
        items={[
          {
            id: 1,
            href: 'https://www.ovh.com',
            target: '_blank',
            label: 'ovh.com',
          },
          {
            id: 2,
            href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
            target: '_blank',
            label: 'Guides OVH',
          },
        ]}
      />
    }
    changelogButton={
      <ChangelogButton
        links={{
          changelog: 'https://ovh.com/',
          roadmap: 'https://ovh.com/',
          'feature-request': 'https://ovh.com/',
        }}
      />
    }
  />
);

const headerWithActions = () => (
  <Headers
    title="Example for header with actions "
    GuideMenu={
      <ActionMenu
        id="1"
        items={[
          {
            id: 1,
            href: 'https://www.ovh.com',
            target: '_blank',
            label: 'Action 1',
          },
          {
            id: 2,
            href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
            target: '_blank',
            label: 'Action 2',
          },
        ]}
      />
    }
  />
);

describe('Headers component', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  it('renders header with title', async () => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
    const { container } = render(header());
    expect(container).toMatchSnapshot();
  });

  it('renders header with header buttons correctly', async () => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
    const { container } = render(headerWithHeaderButtons());
    expect(container).toMatchSnapshot();
  });

  it('renders header with actions correctly', async () => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
    const { container } = render(headerWithActions());
    expect(container).toMatchSnapshot();
  });
});
