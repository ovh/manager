import '@/domain/setupTests';
import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { wrapper } from '@/domain/utils/test.provider';
import PriceCard from '@/domain/components/Card/PriceCard';

describe('Price card component', () => {
  it('Render Card with title DNSSEC checked and Test in footer', () => {
    const { getByTestId } = render(
      <PriceCard
        onCheckBoxChange={vi.fn()}
        checked={true}
        footer={<Text preset={TEXT_PRESET.heading4}>Test</Text>}
        title="DNSSEC"
      />,
      { wrapper },
    );
    expect(getByTestId('checkbox-price-card-control')).toHaveAttribute(
      'data-state',
      'checked',
    );
    expect(getByTestId('price-content')).toBeInTheDocument();
    expect(getByTestId('price-footer')).toBeInTheDocument();
    expect(getByTestId('price-card')).toBeInTheDocument();
  });

  it('Render Card with title DNSSEC not checked and Test in footer', () => {
    const { getByTestId } = render(
      <PriceCard
        onCheckBoxChange={vi.fn()}
        checked={false}
        footer={<Text preset={TEXT_PRESET.heading4}>Test</Text>}
        title="DNSSEC"
      />,
      { wrapper },
    );
    expect(getByTestId('checkbox-price-card-control')).toHaveAttribute(
      'data-state',
      'unchecked',
    );
    expect(getByTestId('price-content')).toBeInTheDocument();
    expect(getByTestId('price-footer')).toBeInTheDocument();
    expect(getByTestId('price-card')).toBeInTheDocument();
  });

  it('Render Card with title DNSSEC not checked and Test in footer and disabled', () => {
    const { getByTestId } = render(
      <PriceCard
        onCheckBoxChange={vi.fn()}
        checked={true}
        disabled={true}
        footer={<Text preset={TEXT_PRESET.heading4}>Test</Text>}
        title="DNSSEC"
      />,
      { wrapper },
    );
    expect(getByTestId('checkbox-price-card-control')).toHaveAttribute(
      'data-state',
      'checked',
    );
    expect(getByTestId('checkbox-price-card')).toHaveAttribute(
      'data-disabled',
      '',
    );
    expect(getByTestId('price-content')).toBeInTheDocument();
    expect(getByTestId('price-content')).toHaveClass('bg-gray-50');
    expect(getByTestId('price-footer')).toBeInTheDocument();
    expect(getByTestId('price-card')).toBeInTheDocument();
  });
});
