import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { PciNumberInput } from './PciNumberInput.component';

describe('PciNumberInput Component', () => {
  const label = 'Test Label';
  const description = 'Test Description';
  const onChangeMock = vi.fn();

  it('displays label and input field', () => {
    const { getByText, getByTestId } = render(
      <PciNumberInput value={5} label={label} onChange={onChangeMock} />,
    );
    expect(getByText(label)).toBeInTheDocument();
    expect(getByTestId('pciNumberInput-input')).toHaveValue(5);
  });

  it('displays description when provided', () => {
    const { getByText } = render(
      <PciNumberInput
        value={5}
        label={label}
        description={description}
        onChange={onChangeMock}
      />,
    );
    expect(getByText(description)).toBeInTheDocument();
  });

  it('does not display description when not provided', () => {
    const { queryByText } = render(
      <PciNumberInput value={5} label={label} onChange={onChangeMock} />,
    );
    expect(queryByText(description)).toBeNull();
  });
});
