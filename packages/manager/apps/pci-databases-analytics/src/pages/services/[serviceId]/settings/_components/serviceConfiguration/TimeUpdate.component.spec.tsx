import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import TimeUpdate from '@/pages/services/[serviceId]/settings/_components/serviceConfiguration/TimeUpdate.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

const mockedOnSubmit = vi.fn();
describe('Time update component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders time update and cancel modification', async () => {
    render(<TimeUpdate onSubmit={mockedOnSubmit} initialValue={new Date()} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('edit-time-update-button')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('edit-time-update-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('cancel-time-update-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('cancel-time-update-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('cancel-time-update-button'),
      ).not.toBeInTheDocument();
      expect(mockedOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('renders time update and submit modification', async () => {
    render(<TimeUpdate onSubmit={mockedOnSubmit} initialValue={new Date()} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('edit-time-update-button')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('edit-time-update-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('submit-time-update-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('submit-time-update-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('submit-time-update-button'),
      ).not.toBeInTheDocument();
      expect(mockedOnSubmit).toHaveBeenCalled();
    });
  });

  it('renders time update and submit modification', async () => {
    render(
      <TimeUpdate
        onSubmit={mockedOnSubmit}
        initialValue={new Date()}
        readonly={true}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('edit-time-update-button'),
      ).not.toBeInTheDocument();
    });
  });
});
