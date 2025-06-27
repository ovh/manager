import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PaymentIcon from './PaymentIcon';
import { TPaymentMethodIcon } from '@/data/types/payment/payment-method.type';

describe('PaymentIcon', () => {
  it('should render nothing when icon is undefined', () => {
    const { container } = render(<PaymentIcon icon={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render image when icon has data URL', () => {
    const mockIcon: TPaymentMethodIcon = {
      name: 'visa',
      data:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      url: undefined,
      componentIcon: undefined,
    };

    const { container } = render(<PaymentIcon icon={mockIcon} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockIcon.data);
    expect(image).toHaveAttribute('alt', 'visa');
    expect(image).toHaveClass('max-h-8', 'max-w-8');
  });

  it('should render image when icon has URL', () => {
    const mockIcon: TPaymentMethodIcon = {
      name: 'mastercard',
      data: undefined,
      url: 'https://example.com/mastercard.png',
      componentIcon: undefined,
    };

    const { container } = render(<PaymentIcon icon={mockIcon} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/mastercard.png');
    expect(image).toHaveAttribute('alt', 'mastercard');
    expect(image).toHaveClass('max-h-8', 'max-w-8');
  });

  it('should prefer data URL over URL when both are present', () => {
    const mockIcon: TPaymentMethodIcon = {
      name: 'paypal',
      data: 'data:image/png;base64,test',
      url: 'https://example.com/paypal.png',
      componentIcon: undefined,
    };

    const { container } = render(<PaymentIcon icon={mockIcon} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'data:image/png;base64,test');
    expect(image).toHaveAttribute('alt', 'paypal');
  });

  it('should render OdsIcon when icon has componentIcon', () => {
    const mockIcon: TPaymentMethodIcon = {
      name: 'bank',
      data: undefined,
      url: undefined,
      componentIcon: 'plus',
    };

    const { container } = render(<PaymentIcon icon={mockIcon} />);

    const icon = container.querySelector('[data-testid="ods-icon"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('max-h-8', 'max-w-8');
  });

  it('should prefer image over componentIcon when both image source and componentIcon are present', () => {
    const mockIcon: TPaymentMethodIcon = {
      name: 'visa',
      data: 'data:image/png;base64,test',
      url: undefined,
      componentIcon: 'plus',
    };

    const { container } = render(<PaymentIcon icon={mockIcon} />);

    const image = container.querySelector('img');
    const icon = container.querySelector('[data-testid="ods-icon"]');

    expect(image).toBeInTheDocument();
    expect(icon).not.toBeInTheDocument();
  });

  it('should render nothing when icon has no valid source', () => {
    const mockIcon: TPaymentMethodIcon = {
      name: 'unknown',
      data: undefined,
      url: undefined,
      componentIcon: undefined,
    };

    const { container } = render(<PaymentIcon icon={mockIcon} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when URL is empty string', () => {
    const mockIcon: TPaymentMethodIcon = {
      name: 'test',
      data: undefined,
      url: '',
      componentIcon: undefined,
    };

    const { container } = render(<PaymentIcon icon={mockIcon} />);

    // Empty string is falsy, so should render nothing
    expect(container.firstChild).toBeNull();
  });

  it('should handle null data', () => {
    const mockIcon: TPaymentMethodIcon = {
      name: 'test',
      data: undefined,
      url: 'https://example.com/test.png',
      componentIcon: undefined,
    };

    const { container } = render(<PaymentIcon icon={mockIcon} />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test.png');
  });
});
