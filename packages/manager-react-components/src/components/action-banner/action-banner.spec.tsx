import React from 'react';
import { vitest } from 'vitest';
import { fireEvent, screen, render } from '@testing-library/react';
import { ActionBanner, ActionBannerProps } from './action-banner.component';

const renderComponent = (props: ActionBannerProps) =>
  render(<ActionBanner {...props} />);

describe('ActionBanner tests', () => {
  it('should display message', () => {
    renderComponent({
      message: 'hello world',
      cta: 'custom action',
      onClick: () => {},
    });

    expect(screen.getAllByText('hello world')).not.toBeNull();
  });

  it('should have a working call to action button', () => {
    const mockOnClick = vitest.fn();

    renderComponent({
      message: 'hello world',
      cta: 'custom action',
      onClick: mockOnClick,
    });
    expect(screen.getByTestId('actionBanner-button')).not.toBeNull();
    const cta = screen.queryByTestId('actionBanner-button');
    expect(mockOnClick).not.toHaveBeenCalled();
    fireEvent.click(cta);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should have a link action', () => {
    const href = 'www.ovhcloud.com';
    renderComponent({
      message: 'hello world',
      cta: 'custom action',
      href,
    });
    const link = screen.queryByTestId('action-banner-link');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe(href);
    expect(link.getAttribute('target')).toBe('_blank');
  });
});
