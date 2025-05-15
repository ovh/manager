import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import StatusComponent from './Status.component';

describe('StatusComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with creating status', () => {
    const { getByTestId } = render(<StatusComponent status="creating" />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'warning');
    expect(badge).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_status_creating',
    );
  });

  it('renders with deleting status', () => {
    const { getByTestId } = render(<StatusComponent status="deleting" />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'warning');
    expect(badge).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_status_deleting',
    );
  });

  it('renders with restoring status', () => {
    const { getByTestId } = render(<StatusComponent status="restoring" />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'warning');
    expect(badge).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_status_restoring',
    );
  });

  it('renders with error status', () => {
    const { getByTestId } = render(<StatusComponent status="error" />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'critical');
    expect(badge).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_status_error',
    );
  });

  it('renders with ok status', () => {
    const { getByTestId } = render(<StatusComponent status="ok" />);

    const badge = getByTestId('status_badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-color', 'success');
    expect(badge).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_status_ok',
    );
  });

  it('updates badge color when status changes', () => {
    const { rerender, getByTestId } = render(
      <StatusComponent status="creating" />,
    );

    let badge = getByTestId('status_badge');
    expect(badge).toHaveAttribute('data-color', 'warning');

    // Rerender with a different status
    rerender(<StatusComponent status="error" />);

    badge = getByTestId('status_badge');
    expect(badge).toHaveAttribute('data-color', 'critical');
  });
});
