import { it, vi, describe, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import BetaManagerButton from './BetaManagerButton.component';
import {
  BETA_MANAGER_TRACKING_CLICK,
  BETA_MANAGER_URL,
} from './BetaManagerButton.constants';

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

  it('should track the click on the beta manager button', () => {
    const { container } = render(<BetaManagerButton />);

    fireEvent.click(container.querySelector(`a[href="${BETA_MANAGER_URL}"]`));

    expect(trackClick).toHaveBeenCalledWith({
      name: 'topnav::go-to-manager-v8-beta',
      type: 'navigation',
    });
    expect(trackClick).toHaveBeenCalledWith(BETA_MANAGER_TRACKING_CLICK);
  });
});
