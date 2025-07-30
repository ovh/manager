/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Contracts from './Contracts';

describe('Contracts', () => {
  const contracts = [
    {
      url: 'https://example.com/contract1',
      name: 'Contract 1',
      content: 'Some content 1',
    },
    {
      url: 'https://example.com/contract2',
      name: 'Contract 2',
      content: 'Some content 2',
    },
  ];

  it('renders checkbox and label', () => {
    const { getByTestId } = render(
      <Contracts
        contracts={contracts}
        isChecked={false}
        onCheckChanged={vi.fn()}
      />,
    );

    const checkBox = getByTestId('contracts-checkbox');

    expect(checkBox).toBeVisible();
    expect(screen.getByText('order_contracts_label')).toBeVisible();
  });

  it('renders contracts list when contracts are provided', () => {
    render(
      <Contracts
        contracts={contracts}
        isChecked={false}
        onCheckChanged={vi.fn()}
      />,
    );

    contracts.forEach((contract) => {
      expect(screen.getByRole('link', { name: contract.name })).toHaveAttribute(
        'href',
        contract.url,
      );
    });
  });

  it('renders skeleton when isLoading true', () => {
    const { getByTestId } = render(
      <Contracts isLoading={true} isChecked={false} onCheckChanged={vi.fn()} />,
    );

    const skeleton = getByTestId('contracts-skeleton');
    expect(skeleton).toBeVisible();
  });

  it('disables checkbox if contracts are missing or empty', () => {
    const { getByTestId } = render(
      <Contracts isChecked={false} onCheckChanged={vi.fn()} />,
    );

    const checkBox = getByTestId('contracts-checkbox');
    expect(checkBox).toHaveAttribute('data-disabled', 'true');
  });

  it('enables checkbox if contracts are present', () => {
    const { getByTestId } = render(
      <Contracts
        contracts={contracts}
        isChecked={false}
        onCheckChanged={vi.fn()}
      />,
    );

    const checkBox = getByTestId('contracts-checkbox');
    expect(checkBox).toHaveAttribute('data-disabled', 'false');
  });

  it('calls onCheckChanged when checkbox is toggled', () => {
    const onCheckChanged = vi.fn();
    const { getByTestId } = render(
      <Contracts
        contracts={contracts}
        isChecked={false}
        onCheckChanged={onCheckChanged}
      />,
    );

    const checkbox = getByTestId('contracts-checkbox');

    checkbox.dispatchEvent(
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );
    expect(onCheckChanged).toHaveBeenCalledWith(true);
  });
});
