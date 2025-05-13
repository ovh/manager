import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import StatusComponent, {
  COLD_ARCHIVE_CONTAINER_STATUS_LABEL,
} from './Status.components';
import { COLD_ARCHIVE_CONTAINER_STATUS } from '@/constants';

describe('StatusComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(
    Object.entries(COLD_ARCHIVE_CONTAINER_STATUS).map(([key, status]) => [
      status,
      COLD_ARCHIVE_CONTAINER_STATUS_LABEL[key],
    ]),
  )(
    'renders correct color badge and label for status "%s"',
    (status, expectedColor) => {
      const props = {
        status,
        name: 'test-container',
        automaticDeletionAt: null,
      };

      render(<StatusComponent {...props} />);

      const badge = screen.getByTestId('status_badge');
      expect(badge).toHaveAttribute('color', expectedColor);
      expect(badge).toHaveAttribute(
        'label',
        `pci_projects_project_storages_containers_status_${status}`,
      );
    },
  );

  it('renders additional info when status is RESTORED and automaticDeletionAt is provided', () => {
    const props = {
      status: COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
      name: 'test-container',
      automaticDeletionAt: '2023-01-01T12:00:00Z',
    };

    render(<StatusComponent {...props} />);

    const badge = screen.getByTestId('status_badge');
    const restoreDateText = screen.getByTestId('status_restore-date_text');
    const restoreDateTooltip = screen.getByTestId(
      'status_restore-date_tooltip',
    );

    expect(badge).toHaveAttribute(
      'label',
      `pci_projects_project_storages_containers_status_restored`,
    );
    expect(badge).toHaveAttribute('color', 'success');
    expect(restoreDateText).toBeVisible();
    expect(restoreDateTooltip).toBeVisible();
  });

  it('does not render additional info when status is RESTORED but automaticDeletionAt is not provided', () => {
    const props = {
      status: COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
      name: 'test-container',
      automaticDeletionAt: null,
    };

    render(<StatusComponent {...props} />);

    const badge = screen.getByTestId('status_badge');
    expect(badge).toBeVisible();

    expect(
      screen.queryByTestId('status_restore-date_text'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('status_restore-date_tooltip'),
    ).not.toBeInTheDocument();
  });

  it('should verify all status mappings match expected values', () => {
    expect(COLD_ARCHIVE_CONTAINER_STATUS_LABEL).toEqual({
      ARCHIVED: 'success',
      ARCHIVING: 'information',
      DELETING: 'warning',
      FLUSHED: 'critical',
      NONE: 'neutral',
      RESTORED: 'success',
      RESTORING: 'information',
    });
  });
});
