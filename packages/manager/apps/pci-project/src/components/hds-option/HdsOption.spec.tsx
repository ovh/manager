/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';
import HdsOption from './HdsOption';
import { HDS_INFO } from '@/constants';

describe('HdsOption', () => {
  const defaultProps = {
    isChecked: false,
    onCheckChanged: vi.fn(),
    isValidForCertification: true,
    isAlreadyCertifiedProject: false,
  };

  it('renders the correct HDS info link for subsidiary', () => {
    render(<HdsOption {...defaultProps} />, {
      wrapper: createOptimalWrapper({ queries: true, shell: true }),
    });

    const link = screen.getByTestId('ods-link');
    expect(link).toHaveAttribute('href', HDS_INFO.FR);
  });

  it('disables checkbox if already certified', () => {
    render(<HdsOption {...defaultProps} isAlreadyCertifiedProject={true} />, {
      wrapper: createOptimalWrapper({ queries: true, shell: true }),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('data-disabled', 'true');
  });

  it('disables checkbox if not valid for certification', () => {
    render(<HdsOption {...defaultProps} isValidForCertification={false} />, {
      wrapper: createOptimalWrapper({ queries: true, shell: true }),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('data-disabled', 'true');
  });

  it('enables checkbox if valid and not already certified', () => {
    render(<HdsOption {...defaultProps} />, {
      wrapper: createOptimalWrapper({ queries: true, shell: true }),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('data-disabled', 'false');
  });

  it('calls handleCheckChanged when checkbox is toggled', () => {
    const handleCheckChanged = vi.fn();
    render(
      <HdsOption {...defaultProps} onCheckChanged={handleCheckChanged} />,
      {
        wrapper: createOptimalWrapper({ queries: true, shell: true }),
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
      wrapper: createOptimalWrapper({ queries: true, shell: true }),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('data-checked', 'true');
  });

  it('shows unchecked state when isChecked is false', () => {
    render(<HdsOption {...defaultProps} isChecked={false} />, {
      wrapper: createOptimalWrapper({ queries: true, shell: true }),
    });

    const checkbox = screen.getByTestId('hds-checkbox');
    expect(checkbox).toHaveAttribute('data-checked', 'false');
  });
});
