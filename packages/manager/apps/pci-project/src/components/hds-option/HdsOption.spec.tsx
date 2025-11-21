import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { createWrapper } from '@/wrapperRenders';
import HdsOption from './HdsOption';
import { getHdsInfoUrl } from '@/constants';

describe('HdsOption', () => {
  const defaultProps = {
    isChecked: false,
    onCheckChanged: vi.fn(),
    isValidForCertification: true,
    isAlreadyCertifiedProject: false,
  };

  it('renders the correct HDS info link for subsidiary', () => {
    render(<HdsOption {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const link = screen.getByTestId('ods-link');
    expect(link).toHaveAttribute('href', getHdsInfoUrl('FR' as OvhSubsidiary));
  });

  it('disables checkbox if already certified', () => {
    render(<HdsOption {...defaultProps} isAlreadyCertifiedProject={true} />, {
      wrapper: createWrapper(),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('is-disabled', 'true');
  });

  it('disables checkbox if not valid for certification', () => {
    render(<HdsOption {...defaultProps} isValidForCertification={false} />, {
      wrapper: createWrapper(),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('is-disabled', 'true');
  });

  it('enables checkbox if valid and not already certified', () => {
    render(<HdsOption {...defaultProps} />, { wrapper: createWrapper() });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('is-disabled', 'false');
  });

  it('calls handleCheckChanged when checkbox is toggled', () => {
    const handleCheckChanged = vi.fn();
    render(
      <HdsOption {...defaultProps} onCheckChanged={handleCheckChanged} />,
      {
        wrapper: createWrapper(),
      },
    );

    const checkbox = screen.getByTestId('hds-checkbox');
    checkbox.dispatchEvent(
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    expect(handleCheckChanged).toHaveBeenCalledWith(true);
  });

  it('shows checked state when isChecked is true', () => {
    render(<HdsOption {...defaultProps} isChecked={true} />, {
      wrapper: createWrapper(),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('is-checked', 'true');
  });

  it('shows unchecked state when isChecked is false', () => {
    render(<HdsOption {...defaultProps} isChecked={false} />, {
      wrapper: createWrapper(),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('is-checked', 'false');
  });
});
