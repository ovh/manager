import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { Notifications } from '../Notifications.component';
import { useNotifications } from '../useNotifications';

vi.mock('@ovhcloud/ods-react', () => ({
  Message: vi.fn(({ color, dismissible, children, onRemove }) => (
    <div data-testid={`message-${color}`} className={color}>
      {children}
      {dismissible && (
        <button
          data-testid={`dismissible-${dismissible}`}
          onClick={() => {
            onRemove();
          }}
        >
          x
        </button>
      )}
    </div>
  )),
  MESSAGE_COLOR: {
    success: 'success',
    critical: 'critical',
    warning: 'warning',
    information: 'information',
  },
}));

// Mock react-router-dom's useLocation
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

// Mock custom hook
const mockClearNotifications = vi.fn();
const mockClearNotification = vi.fn();

vi.mock('../useNotifications', () => ({
  useNotifications: vi.fn(() => ({
    notifications: [],
    clearNotifications: mockClearNotifications,
    clearNotification: mockClearNotification,
  })),
}));

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  (useLocation as any).mockReturnValue({ pathname: '/home' });
});

describe('Notifications Component', () => {
  const mockNotifications = [
    {
      uid: '1',
      content: 'This is a success message.',
      type: 'success',
      dismissible: true,
    },
    {
      uid: '2',
      content: 'This is an error message.',
      type: 'error',
      dismissible: false,
    },
    {
      uid: '3',
      content: 'This is an alert message.',
      type: 'warning',
      dismissible: false,
    },
    {
      uid: '4',
      content: 'This is an information message.',
      type: 'info',
    },
  ];

  it('should render all notifications', () => {
    (useLocation as any).mockReturnValue({ pathname: '/home' });
    (useNotifications as any).mockReturnValue({
      notifications: mockNotifications,
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
    (useLocation as any).mockReturnValue({ pathname: '/home' });
    (useNotifications as any).mockReturnValue({
      notifications: mockNotifications,
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
    (useLocation as any).mockReturnValue({ pathname: '/home' });
    (useNotifications as any).mockReturnValue({
      notifications: [mockNotifications[0]],
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
    (useLocation as any).mockReturnValue({ pathname: '/home' });
    (useNotifications as any).mockReturnValue({
      notifications: mockNotifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    render(<Notifications />);
    const buttons = screen.getAllByTestId(/dismissible-/i);

    expect(buttons.length).toBe(2);
  });

  it('should clear notifications when location changes and clearAfterRead is true', () => {
    (useLocation as any).mockReturnValue({ pathname: '/old-path' });
    (useNotifications as any).mockReturnValue({
      notifications: mockNotifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    const { rerender } = render(<Notifications clearAfterRead={true} />);

    // Simulate route change
    (useLocation as any).mockReturnValue({ pathname: '/new-path' });
    rerender(<Notifications clearAfterRead={true} />);

    expect(mockClearNotifications).toHaveBeenCalled();
  });

  it('should NOT clear notifications when location changes and clearAfterRead is false', () => {
    (useLocation as any).mockReturnValue({ pathname: '/old-path' });
    (useNotifications as any).mockReturnValue({
      notifications: mockNotifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    const { rerender } = render(<Notifications clearAfterRead={false} />);

    // Simulate route change
    (useLocation as any).mockReturnValue({ pathname: '/new-path' });
    rerender(<Notifications clearAfterRead={false} />);

    expect(mockClearNotifications).not.toHaveBeenCalled();
  });

  it('should not clear notifications if same path', () => {
    (useLocation as any).mockReturnValue({ pathname: '/same-path' });
    (useNotifications as any).mockReturnValue({
      notifications: mockNotifications,
      clearNotifications: mockClearNotifications,
      clearNotification: mockClearNotification,
    });

    const { rerender } = render(<Notifications clearAfterRead={true} />);

    rerender(<Notifications clearAfterRead={true} />); // re-render with same path

    expect(mockClearNotifications).not.toHaveBeenCalled();
  });
});
