import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { HubSupportHelp } from './HubSupportHelp.component';

vi.mock('@/hooks/guideUtils/useGuideUtils', () => ({
  default: vi.fn().mockReturnValue({
    Home: 'https://docs.ovh.com/fr/',
  }),
}));

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({ trackClick: trackClickMock }),
  ButtonType: {
    link: 'link',
  },
}));

describe('HubSupportHelp Component', () => {
  it('renders help text correctly', () => {
    render(<HubSupportHelp />);

    expect(screen.getByText('hub_support_need_help')).toBeInTheDocument();
    expect(screen.getByText('hub_support_need_help_more')).toBeInTheDocument();
    expect(screen.getByText('hub_support_help')).toBeInTheDocument();
  });

  it('renders the correct help URL', () => {
    render(<HubSupportHelp />);

    const linkElement = screen
      .getByText('hub_support_help')
      .closest('osds-link');
    expect(linkElement).toHaveAttribute('href', 'https://docs.ovh.com/fr/');
    expect(linkElement).toHaveAttribute('target', '_blank');
  });

  it('calls trackClick on link click', async () => {
    render(<HubSupportHelp />);

    const linkElement = screen.getByText('hub_support_help');

    await act(() => fireEvent.click(linkElement));

    expect(trackClickMock).toHaveBeenCalledWith({
      buttonType: 'link',
      actionType: 'navigation',
      actions: ['activity', 'assistance', 'guide-welcome', 'go-to-docs'],
    });
  });
});
