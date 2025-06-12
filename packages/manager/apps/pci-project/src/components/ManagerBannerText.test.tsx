import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import ManagerBannerText from './ManagerBannerText';

const mockShellContext = {
  environment: {
    getMessage: vi.fn(),
    getUserLanguage: vi.fn(),
  },
};

const createWrapper = (contextValue: typeof mockShellContext) => {
  return ({ children }: { children: React.ReactNode }) => (
    <ShellContext.Provider value={contextValue as never}>
      {children}
    </ShellContext.Provider>
  );
};

describe('ManagerBannerText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when no message is available', () => {
    mockShellContext.environment.getMessage.mockReturnValue(null);
    mockShellContext.environment.getUserLanguage.mockReturnValue('en');

    const { container } = render(<ManagerBannerText />, {
      wrapper: createWrapper(mockShellContext),
    });

    expect(container.firstChild).toBeNull();
  });

  it('should render message in user language when available', () => {
    const mockMessage = {
      en: { description: 'English message' },
      fr: { description: 'Message français' },
    };

    mockShellContext.environment.getMessage.mockReturnValue(mockMessage);
    mockShellContext.environment.getUserLanguage.mockReturnValue('fr');

    render(<ManagerBannerText />, {
      wrapper: createWrapper(mockShellContext),
    });

    expect(screen.getByText('Message français')).toBeInTheDocument();
  });

  it('should fallback to English when user language is not available', () => {
    const mockMessage = {
      en: { description: 'English fallback message' },
      fr: { description: 'Message français' },
    };

    mockShellContext.environment.getMessage.mockReturnValue(mockMessage);
    mockShellContext.environment.getUserLanguage.mockReturnValue('de');

    render(<ManagerBannerText />, {
      wrapper: createWrapper(mockShellContext),
    });

    expect(screen.getByText('English fallback message')).toBeInTheDocument();
  });

  it('should render message with warning color', () => {
    const mockMessage = {
      en: { description: 'Test message' },
    };

    mockShellContext.environment.getMessage.mockReturnValue(mockMessage);
    mockShellContext.environment.getUserLanguage.mockReturnValue('en');

    render(<ManagerBannerText />, {
      wrapper: createWrapper(mockShellContext),
    });

    const messageElement = screen
      .getByText('Test message')
      .closest('[color="warning"]');
    expect(messageElement).toBeInTheDocument();
  });

  it('should handle empty message object', () => {
    mockShellContext.environment.getMessage.mockReturnValue({});
    mockShellContext.environment.getUserLanguage.mockReturnValue('en');

    render(<ManagerBannerText />, {
      wrapper: createWrapper(mockShellContext),
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
