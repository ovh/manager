import { it, vi, describe, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import BetaManagerButton from './BetaManagerButton.component';
import { BETA_MANAGER_URL } from './BetaManagerButton.constants';

const trackClick = vi.fn();
let isBetaManagerAvailable = true;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: () => ({
    data: { 'pnr:beta-manager': isBetaManagerAvailable },
  }),
}));

const currentPageTracking = {
  page: { name: 'hub::app::dashboard::dashboard' },
  level2: '88',
  page_category: 'dashboard',
  page_theme: 'hub',
};

vi.mock('@/core/tracking', () => ({
  getCurrentPageTracking: () => currentPageTracking,
}));

vi.mock('@/context', () => ({
  useShell: () => ({
    getPlugin: () => ({ trackClick }),
  }),
}));

describe('BetaManagerButton.component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isBetaManagerAvailable = true;
  });

  it('should not render when the beta manager feature is not available', () => {
    isBetaManagerAvailable = false;

    const { container } = render(<BetaManagerButton />);

    expect(container.querySelector(`a[href="${BETA_MANAGER_URL}"]`)).toBeNull();
  });

  it('should track the click on the beta manager button with the current page', () => {
    const { container } = render(<BetaManagerButton />);

    fireEvent.click(container.querySelector(`a[href="${BETA_MANAGER_URL}"]`));

    expect(trackClick).toHaveBeenCalledWith({
      name: 'topnav::go-to-manager-v8-beta',
      type: 'navigation',
      ...currentPageTracking,
    });
  });
});
