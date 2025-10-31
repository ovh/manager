import { act, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { renderActionBanner } from '@/commons/tests-utils/Render.utils';
import { MOCK_ACTION_BANNER, MOCK_URL } from '@/commons/tests-utils/StaticData.constants';
import type { ActionBannerProps } from '@/components/action-banner/ActionBanner.props';

describe('ActionBanner', () => {
  it('should display the provided message', () => {
    const props: ActionBannerProps = {
      ...MOCK_ACTION_BANNER,
      onClick: vi.fn(),
      dismissible: true,
    };

    renderActionBanner(props);

    expect(screen.getByText(MOCK_ACTION_BANNER.message)).toBeInTheDocument();
  });

  it('should call onClick when the action button is clicked', () => {
    const mockOnClick = vi.fn();
    const props: ActionBannerProps = {
      ...MOCK_ACTION_BANNER,
      onClick: mockOnClick,
    };

    renderActionBanner(props);

    const ctaButton = screen.getByTestId('action-banner-button');
    expect(ctaButton).toBeInTheDocument();

    expect(mockOnClick).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(ctaButton);
    });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should render a link action when href is provided', () => {
    const props: ActionBannerProps = {
      ...MOCK_ACTION_BANNER,
      href: MOCK_URL,
    };

    renderActionBanner(props);

    const link = screen.getByTestId('action-banner-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', MOCK_URL);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
