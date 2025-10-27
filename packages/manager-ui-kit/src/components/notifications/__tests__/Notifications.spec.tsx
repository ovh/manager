import React from 'react';

import { useLocation } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedFunction, beforeEach, describe, expect, it, vi } from 'vitest';

import { notifications } from '@/commons/tests-utils/StaticData.constants';

import { Notifications } from '../Notifications.component';
import { useNotifications } from '../useNotifications';

vi.mock('@ovhcloud/ods-react', () => ({
  Message: vi.fn(
    ({
      color,
      dismissible,
      children,
      onRemove,
    }: {
      color: string;
      dismissible?: boolean;
      children: React.ReactNode;
      onRemove?: () => void;
    }) => (
      <div data-testid={`message-${color}`} className={color}>
        {children}
        {dismissible && (
          <button data-testid={`dismissible-${dismissible}`} onClick={() => onRemove?.()}>
            x
          </button>
        )}
      </div>
    ),
  ),
  MESSAGE_COLOR: {
    success: 'success',
    critical: 'critical',
    warning: 'warning',
    information: 'information',
  },
}));

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

vi.mock('../useNotifications', () => ({
  useNotifications: vi.fn(),
}));

const mockUseLocation = useLocation as MockedFunction<typeof useLocation>;
const mockUseNotifications = useNotifications as unknown as MockedFunction<typeof useNotifications>;

const mockClearNotifications = vi.fn();
const mockClearNotification = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockUseLocation.mockReturnValue({
    pathname: '/home',
    state: undefined,
    key: '',
    search: '',
    hash: '',
  });
});

describe('Notifications Component', () => {
  it('should render all notifications', () => {
    mockUseLocation.mockReturnValue({ pathname: '/home' } as ReturnType<typeof useLocation>);
    mockUseNotifications.mockReturnValue({
      notifications: notifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    render(<Notifications />);

    expect(screen.getByTestId('message-success')).toBeInTheDocument();
    expect(screen.getByTestId('message-critical')).toBeInTheDocument();
    expect(screen.getByTestId('message-warning')).toBeInTheDocument();
    expect(screen.getByTestId('message-information')).toBeInTheDocument();
  });

  it('should map notification types to correct ODS Message colors', () => {
    mockUseLocation.mockReturnValue({ pathname: '/home' } as ReturnType<typeof useLocation>);
    mockUseNotifications.mockReturnValue({
      notifications: notifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    const { getAllByTestId } = render(<Notifications />);
    const messages = getAllByTestId(/message-/i);

    expect(messages[0]).toHaveClass('success');
    expect(messages[1]).toHaveClass('critical');
    expect(messages[2]).toHaveClass('warning');
    expect(messages[3]).toHaveClass('information');
  });

  it('should call clearNotification when a dismissible notification is dismissed', async () => {
    mockUseLocation.mockReturnValue({ pathname: '/home' } as ReturnType<typeof useLocation>);
    mockUseNotifications.mockReturnValue({
      notifications: [notifications[0]],
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    render(<Notifications />);
    const dismissButton = screen.getByTestId('dismissible-true');

    fireEvent.click(dismissButton);

    await waitFor(() => {
      expect(mockClearNotification).toHaveBeenCalledWith('1');
    });
  });

  it('should not render dismiss button if dismissible is false', () => {
    mockUseLocation.mockReturnValue({ pathname: '/home' } as ReturnType<typeof useLocation>);
    mockUseNotifications.mockReturnValue({
      notifications: notifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    render(<Notifications />);
    const buttons = screen.getAllByTestId(/dismissible-/i);

    expect(buttons.length).toBe(2); // only dismissible ones
  });

  it('should clear notifications when location changes and clearAfterRead is true', () => {
    mockUseLocation.mockReturnValue({ pathname: '/old-path' } as ReturnType<typeof useLocation>);
    mockUseNotifications.mockReturnValue({
      notifications: notifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    const { rerender } = render(<Notifications clearAfterRead={true} />);

    // Simulate route change
    mockUseLocation.mockReturnValue({ pathname: '/new-path' } as ReturnType<typeof useLocation>);
    rerender(<Notifications clearAfterRead={true} />);

    expect(mockClearNotifications).toHaveBeenCalled();
  });

  it('should NOT clear notifications when clearAfterRead is false', () => {
    mockUseLocation.mockReturnValue({ pathname: '/old-path' } as ReturnType<typeof useLocation>);
    mockUseNotifications.mockReturnValue({
      notifications: notifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    const { rerender } = render(<Notifications clearAfterRead={false} />);

    mockUseLocation.mockReturnValue({ pathname: '/new-path' } as ReturnType<typeof useLocation>);
    rerender(<Notifications clearAfterRead={false} />);

    expect(mockClearNotifications).not.toHaveBeenCalled();
  });

  it('should not clear notifications if same path', () => {
    mockUseLocation.mockReturnValue({ pathname: '/same-path' } as ReturnType<typeof useLocation>);
    mockUseNotifications.mockReturnValue({
      notifications: notifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    const { rerender } = render(<Notifications clearAfterRead={true} />);

    rerender(<Notifications clearAfterRead={true} />); // same path

    expect(mockClearNotifications).not.toHaveBeenCalled();
  });
});
