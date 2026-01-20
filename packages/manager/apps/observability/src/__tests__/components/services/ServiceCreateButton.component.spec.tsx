import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ServiceCreateButton from '@/components/services/create-button/ServiceCreateButton.component';

const { mockOrderLink } = vi.hoisted(() => ({
  mockOrderLink: 'https://manager.eu.ovhcloud.com/order/observability',
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/hooks/useObservabilityServiceOrderLink.hook', () => ({
  useObservabilityServiceOrderLink: () => mockOrderLink,
}));

vi.mock('@ovhcloud/ods-react', () => ({
  BUTTON_VARIANT: { outline: 'outline' },
  BUTTON_SIZE: { sm: 'sm' },
  Button: ({
    children,
    onClick,
    variant,
    size,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
    size: string;
  }) => (
    <button
      type="button"
      data-testid="create-button"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe('ServiceCreateButton', () => {
  it('should render the button with correct translation key', () => {
    // Act
    render(<ServiceCreateButton />);

    // Assert
    const button = screen.getByTestId('create-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('services:dashboard.enable_service');
  });

  it('should render button with outline variant and sm size', () => {
    // Act
    render(<ServiceCreateButton />);

    // Assert
    const button = screen.getByTestId('create-button');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'sm');
  });

  it('should open order link in new tab when clicked', () => {
    // Arrange
    const mockWindowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

    // Act
    render(<ServiceCreateButton />);
    const button = screen.getByTestId('create-button');
    fireEvent.click(button);

    // Assert
    expect(mockWindowOpen).toHaveBeenCalledWith(mockOrderLink, '_blank', 'noopener,noreferrer');

    // Cleanup
    mockWindowOpen.mockRestore();
  });
});
