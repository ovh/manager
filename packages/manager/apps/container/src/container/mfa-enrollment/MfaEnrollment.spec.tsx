import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MfaEnrollment from './MfaEnrollment';

const mockGetURL = vi.fn(() => 'https://www.mocked-mfa-url.com');
const mockTrackClick = vi.fn();
const mockGetPlugin = vi.fn((plugin: string) => {
  if (plugin === 'navigation') {
    return { getURL: mockGetURL };
  }
  if (plugin === 'tracking') {
    return { trackClick: mockTrackClick };
  }
  return {};
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/context', () => ({
  useShell: () => ({
    getPlugin: mockGetPlugin,
  }),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsButton: (props: any) => (
    <button {...props}>{props.children}</button>
  ),
  OsdsText: (props: any) => <p {...props}>{props.children}</p>,
  OsdsIcon: () => <span data-testid="icon" />,
}));

function setup(props?: Partial<React.ComponentProps<typeof MfaEnrollment>>) {
  const onHide = vi.fn();
  const utils = render(<MfaEnrollment onHide={onHide} {...props} />);
  return { ...utils, onHide };
}

describe('MfaEnrollment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render MFA enrollment text and buttons', () => {
    const { container } = setup();
    expect(container).toBeAccessible();

    expect(screen.getByText('mfa_enrollment_title')).toBeInTheDocument();
    expect(screen.getByText('mfa_enrollment_info1')).toBeInTheDocument();
    expect(screen.getByText('mfa_enrollment_info2')).toBeInTheDocument();
    expect(screen.getByText('mfa_enrollment_cancel')).toBeInTheDocument();
    expect(screen.getByText('mfa_enrollment_go')).toBeInTheDocument();
  });

  it('should hide cancel button when forced=true', () => {
    setup({ forced: true });
    expect(screen.queryByText('mfa_enrollment_cancel')).not.toBeInTheDocument();
    expect(screen.getByText('mfa_enrollment_go')).toBeInTheDocument();
  });

  it('should call onHide when cancel button is clicked', () => {
    const { onHide } = setup();

    fireEvent.click(screen.getByText('mfa_enrollment_cancel'));

    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('should redirect and track when clicking "go"', () => {
    const { onHide } = setup();

    fireEvent.click(screen.getByText('mfa_enrollment_go'));

    expect(mockTrackClick).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'MFA_ENROLLMENT',
        type: 'navigation',
      }),
    );

    expect(mockGetURL).toHaveBeenCalledWith(
      'dedicated',
      expect.stringContaining('/useraccount/security/mfa?redirect_url='),
    );

    expect(onHide).toHaveBeenCalled();
  });
});
