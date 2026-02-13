import '@/common/setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { RENEW_URL } from '@/common/constants';
import { wrapper } from '@/common/utils/test.provider';
import RenewRestoreModal from './RenewRestoreModal';

const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    Trans: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="trans">{children}</div>
    ),
    useTranslation: () => ({
      t: (key: string, options?: { count?: number }) => {
        if (options?.count !== undefined) {
          return `${key}_count_${options.count}`;
        }
        return key;
      },
    }),
  };
});

describe('RenewRestoreModal', () => {
  const mockOnOpenChange = vi.fn();
  const defaultProps = {
    isModalOpenned: true,
    onOpenChange: mockOnOpenChange,
    serviceNames: ['domain1.com', 'domain2.com'],
  };

  const mockUser = {
    ovhSubsidiary: 'FR',
  };

  const mockShellContext = ({
    environment: {
      user: mockUser,
    },
  } as unknown) as React.ContextType<typeof ShellContext>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal when opened', () => {
    render(
      <ShellContext.Provider value={mockShellContext}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    expect(screen.getByTestId('modal')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByTestId('modal-body')).toBeInTheDocument();
  });

  it('should not render modal when closed', () => {
    render(
      <ShellContext.Provider value={mockShellContext}>
        <RenewRestoreModal {...defaultProps} isModalOpenned={false} />
      </ShellContext.Provider>,
      { wrapper },
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should render title with correct count', () => {
    render(
      <ShellContext.Provider value={mockShellContext}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    const titles = screen.getAllByTestId('text');
    const mainTitle = titles.find(
      (t) => t.getAttribute('data-preset') === 'heading4',
    );
    expect(mainTitle).toHaveTextContent(
      'domain_table_modal_renew_restore_title_count_2',
    );
  });

  it('should render description and order texts', () => {
    render(
      <ShellContext.Provider value={mockShellContext}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    expect(
      screen.getByText('domain_table_modal_renew_restore_description'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('trans')).toBeInTheDocument();
  });

  it('should render information message', () => {
    render(
      <ShellContext.Provider value={mockShellContext}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    const messages = screen.getAllByTestId('message');
    const infoMessage = messages.find(
      (msg) => msg.getAttribute('data-color') === 'information',
    );

    expect(infoMessage).toBeInTheDocument();
    expect(infoMessage).toHaveAttribute('data-dismissible', 'false');
    expect(screen.getByTestId('message-icon-circle-check')).toBeInTheDocument();
  });

  it('should show warning message when more than 20 services', () => {
    const manyServices = Array.from(
      { length: 25 },
      (_, i) => `domain${i + 1}.com`,
    );

    render(
      <ShellContext.Provider value={mockShellContext as any}>
        <RenewRestoreModal {...defaultProps} serviceNames={manyServices} />
      </ShellContext.Provider>,
      { wrapper },
    );

    const messages = screen.getAllByTestId('message');
    const warningMessage = messages.find(
      (msg) => msg.getAttribute('data-color') === 'warning',
    );

    expect(warningMessage).toBeInTheDocument();
    expect(screen.getByTestId('message-icon-circle-info')).toBeInTheDocument();
  });

  it('should not show warning message when 20 or fewer services', () => {
    render(
      <ShellContext.Provider value={mockShellContext as any}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    const messages = screen.getAllByTestId('message');
    const warningMessage = messages.find(
      (msg) => msg.getAttribute('data-color') === 'warning',
    );

    expect(warningMessage).toBeUndefined();
  });

  it('should render cancel and renew buttons', () => {
    render(
      <ShellContext.Provider value={mockShellContext as any}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    const buttons = screen.getAllByTestId('button');
    expect(buttons).toHaveLength(2);

    const cancelButton = buttons.find(
      (btn) => btn.getAttribute('data-variant') === 'outline',
    );
    const renewButton = buttons.find(
      (btn) => !btn.getAttribute('data-variant'),
    );

    expect(cancelButton).toHaveTextContent('cancel');
    expect(renewButton).toHaveTextContent(
      'domain_table_modal_renew_restore_button_count_2',
    );
  });

  it('should call onOpenChange when cancel button is clicked', () => {
    render(
      <ShellContext.Provider value={mockShellContext as any}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    const buttons = screen.getAllByTestId('button');
    const cancelButton = buttons.find(
      (btn) => btn.getAttribute('data-variant') === 'outline',
    );

    fireEvent.click(cancelButton!);
    expect(mockOnOpenChange).toHaveBeenCalledWith({ open: false });
  });

  it('should open renew URL when renew button is clicked', () => {
    render(
      <ShellContext.Provider value={mockShellContext as any}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    const buttons = screen.getAllByTestId('button');
    const renewButton = buttons.find(
      (btn) => !btn.getAttribute('data-variant'),
    );

    fireEvent.click(renewButton!);

    const expectedUrl = `${RENEW_URL.FR}domain1.com,domain2.com`;
    expect(mockWindowOpen).toHaveBeenCalledWith(expectedUrl, '_blank');
  });

  it('should use default RENEW_URL when user subsidiary not found', () => {
    const mockUserWithUnknownSubsidiary = {
      ovhSubsidiary: 'UNKNOWN',
    };

    const mockContextWithUnknownSubsidiary = {
      environment: {
        user: mockUserWithUnknownSubsidiary,
      },
    };

    render(
      <ShellContext.Provider value={mockContextWithUnknownSubsidiary as any}>
        <RenewRestoreModal {...defaultProps} />
      </ShellContext.Provider>,
      { wrapper },
    );

    const buttons = screen.getAllByTestId('button');
    const renewButton = buttons.find(
      (btn) => !btn.getAttribute('data-variant'),
    );

    fireEvent.click(renewButton!);

    const expectedUrl = `${RENEW_URL.default}domain1.com,domain2.com`;
    expect(mockWindowOpen).toHaveBeenCalledWith(expectedUrl, '_blank');
  });

  it('should handle single service name', () => {
    render(
      <ShellContext.Provider value={mockShellContext as any}>
        <RenewRestoreModal
          {...defaultProps}
          serviceNames={['single-domain.com']}
        />
      </ShellContext.Provider>,
      { wrapper },
    );

    const titles = screen.getAllByTestId('text');
    expect(titles[0]).toHaveTextContent(
      'domain_table_modal_renew_restore_title_count_1',
    );
    expect(titles[1]).toHaveTextContent(
      'domain_table_modal_renew_restore_description',
    );

    const buttons = screen.getAllByTestId('button');
    const renewButton = buttons.find(
      (btn) => !btn.getAttribute('data-variant'),
    );
    expect(renewButton).toHaveTextContent(
      'domain_table_modal_renew_restore_button_count_1',
    );
  });
});
