import { vitest, vi } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { Headers } from './headers.component';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';
import { useAuthorizationIam } from '../../../hooks/iam';
import { GuideButton, ActionMenu } from '../../navigation';

export const header = () => (
  <Headers title="Example for header" description="description for header" />
);
export const subHeader = () => (
  <Headers
    subtitle="Example for subHeader"
    description="description for subheader"
  />
);
export const headerWithHeaderButtons = () => (
  <Headers
    title="Example for header with header buttons"
    description="description for subheader"
    headerButton={
      <GuideButton
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
  />
);
export const headerWithActions = () => (
  <Headers
    title="Example for header with actions "
    description="description for header"
    headerButton={
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

vitest.mock('../../../hooks/iam');
vitest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({
    trackClick: vi.fn(),
  }),
}));
vitest.mock('storybook-addon-react-router-v6', () => ({
  withRouter: () => vi.fn(),
}));

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('Headers component', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: true,
      isFetched: true,
    });
  });

  it('renders header correctly', async () => {
    render(header());
    await waitFor(() => {
      expect(screen.getByText('Example for header')).toBeInTheDocument();
      expect(screen.getByText('description for header')).toBeInTheDocument();
    });
  });

  it('renders subHeader correctly', async () => {
    render(subHeader());
    await waitFor(() => {
      expect(screen.getByText('Example for subHeader')).toBeInTheDocument();
      expect(screen.getByText('description for subheader')).toBeInTheDocument();
    });
  });

  it('renders header with header buttons correctly', async () => {
    render(headerWithHeaderButtons());
    await waitFor(() => {
      expect(
        screen.getByText('Example for header with header buttons'),
      ).toBeInTheDocument();
      expect(screen.getByText('description for subheader')).toBeInTheDocument();
    });
  });

  it('renders header with actions correctly', async () => {
    render(headerWithActions());
    await waitFor(() => {
      expect(
        screen.getByText('Example for header with actions'),
      ).toBeInTheDocument();
      expect(screen.getByText('description for header')).toBeInTheDocument();
    });
  });
});
