import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import StatusComponent from '@/components/list/Status.component';

describe('StatusComponent', () => {
  it('renders correct color for ACTIVE status', () => {
    const { getByTestId } = render(
      <StatusComponent statusGroup="ACTIVE" status="ACTIVE" />,
    );
    expect(getByTestId('StatusComponent_chip')).toHaveAttribute(
      'color',
      'success',
    );
  });

  it('renders correct color for PENDING status', () => {
    const { getByTestId } = render(
      <StatusComponent statusGroup="PENDING" status="PENDING" />,
    );
    expect(getByTestId('StatusComponent_chip')).toHaveAttribute(
      'color',
      'warning',
    );
  });

  it('renders correct color for ERROR status', () => {
    const { getByTestId } = render(
      <StatusComponent statusGroup="ERROR" status="ERROR" />,
    );
    expect(getByTestId('StatusComponent_chip')).toHaveAttribute(
      'color',
      'error',
    );
  });

  it('renders correct color for unknown status', () => {
    const { getByTestId } = render(
      <StatusComponent statusGroup="UNKNOWN" status="UNKNOWN" />,
    );
    expect(getByTestId('StatusComponent_chip')).toHaveAttribute(
      'color',
      'info',
    );
  });
  it('renders correct translation when status and statusGroup are different', () => {
    const { getByText } = render(
      <StatusComponent statusGroup="ACTIVE" status="PENDING" />,
    );
    expect(
      getByText('pci_projects_project_storages_blocks_status_ACTIVE'),
    ).toBeInTheDocument();
  });
});
