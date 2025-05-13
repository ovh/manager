import { vitest, vi } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import {
  header,
  subHeader,
  headerWithHeaderButtons,
  headerWithActions,
} from './headers.stories';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';
import { useAuthorizationIam } from '../../../hooks/iam';

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
