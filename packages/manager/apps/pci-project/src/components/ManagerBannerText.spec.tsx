import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import ManagerBannerText from './ManagerBannerText';
import { createWrapper } from '@/wrapperRenders';

const mockShellContext = {
  environment: {
    getMessage: vi.fn(),
    getUserLanguage: vi.fn(),
  },
};

describe('ManagerBannerText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when no message is available', () => {
    mockShellContext.environment.getMessage.mockReturnValue(null);
    mockShellContext.environment.getUserLanguage.mockReturnValue('en');

    const { container } = render(<ManagerBannerText />, {
      wrapper: createWrapper((mockShellContext as unknown) as ShellContextType),
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
      wrapper: createWrapper((mockShellContext as unknown) as ShellContextType),
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
      wrapper: createWrapper((mockShellContext as unknown) as ShellContextType),
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
      wrapper: createWrapper((mockShellContext as unknown) as ShellContextType),
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
      wrapper: createWrapper((mockShellContext as unknown) as ShellContextType),
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
