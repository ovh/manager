import { vitest } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import {
  header,
  subHeader,
  headerWithGuides,
  headerWithActions,
} from './headers.stories';
import { IamAuthorizationResponse } from '../../../hooks/iam/iam.interface';
import { useAuthorizationIam } from '../../../hooks/iam';

vitest.mock('../../../hooks/iam');

const mockedHook = (useAuthorizationIam as unknown) as jest.Mock<
  IamAuthorizationResponse
>;

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

  it('renders header with guides correctly', async () => {
    render(headerWithGuides());
    await waitFor(() => {
      expect(
        screen.getByText('Example for header with guides'),
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
