import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import Contacts from '../contacts.component';

vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: vi.fn(() => ({ serviceId: 'test-service-id' })),
  };
});

const mockWindowOpen = vi.fn();
const mockWindowLocation = { href: '' };

beforeEach(() => {
  vi.clearAllMocks();
  global.window.open = mockWindowOpen;
  Object.defineProperty(window, 'location', {
    value: mockWindowLocation,
    writable: true,
  });
});

describe('Contacts component', () => {
  it('should render contact information correctly', () => {
    const { getByText } = render(<Contacts />, { wrapper });

    expect(getByText('Contacts')).toBeInTheDocument();
  });

  it('should render ActionMenu', () => {
    const { getByTestId } = render(<Contacts />, { wrapper });

    const actionMenu = getByTestId('action-menu');
    expect(actionMenu).toBeInTheDocument();
    expect(actionMenu).toHaveAttribute('data-id', 'video-manager-subscription-actions');
  });

  it('should handle change owner click', async () => {
    const { getByTestId } = render(<Contacts />, { wrapper });

    const changeOwnerButton = getByTestId('action-item-2');

    act(() => {
      fireEvent.click(changeOwnerButton);
    });

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalled();
    });
  });

  it('should handle manage contacts click', async () => {
    const { getByTestId } = render(<Contacts />, { wrapper });

    const manageContactsButton = getByTestId('action-item-1');

    act(() => {
      fireEvent.click(manageContactsButton);
    });

    await waitFor(() => {
      // The navigation.getURL is mocked in test.setup.tsx to return 'test-url'
      expect(window.location.href).toBe('test-url');
    });
  });
});
