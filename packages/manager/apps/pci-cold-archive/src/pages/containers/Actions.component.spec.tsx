import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TArchiveContainer } from '@/api/data/archive';
import { COLD_ARCHIVE_CONTAINER_STATUS } from '@/constants';
import ActionsComponent from './Actions.component';

vi.mock('@/hooks/useTracking', () => ({
  useTracking: () => ({
    trackNavigationClick: vi.fn(),
  }),
}));

describe('ActionsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Actions Component Rendering', () => {
    it('should render ActionMenu when actions are available', () => {
      const archive = {
        name: 'test-container',
        status: COLD_ARCHIVE_CONTAINER_STATUS.NONE,
        objectsCount: 10,
        lockedUntil: null,
      } as TArchiveContainer;

      render(<ActionsComponent archive={archive} />);

      expect(
        screen.getByTestId('navigation-action-trigger-action'),
      ).toBeInTheDocument();
    });
  });

  describe('Add User Action', () => {
    it.each([
      [COLD_ARCHIVE_CONTAINER_STATUS.NONE],
      [COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED],
      [COLD_ARCHIVE_CONTAINER_STATUS.RESTORED],
    ])('should show Add User action when status is %s', (status) => {
      const archive = {
        name: 'test-container',
        status,
        objectsCount: 10,
        lockedUntil: null,
      } as TArchiveContainer;

      const { container } = render(<ActionsComponent archive={archive} />);

      const addUserAction = container.querySelector(
        'ods-button[label="pci_projects_project_storages_cold_archive_container_action_add_user"]',
      );

      expect(addUserAction).toBeVisible();
    });

    it.each([
      [COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVING],
      [COLD_ARCHIVE_CONTAINER_STATUS.RESTORING],
      [COLD_ARCHIVE_CONTAINER_STATUS.DELETING],
      [COLD_ARCHIVE_CONTAINER_STATUS.FLUSHED],
    ])('should not show Add User action when status is %s', (status) => {
      const archive = {
        name: 'test-container',
        status,
        objectsCount: 10,
        lockedUntil: null,
      } as TArchiveContainer;

      const { container } = render(<ActionsComponent archive={archive} />);

      const addUserAction = container.querySelector(
        'ods-button[label="pci_projects_project_storages_cold_archive_container_action_add_user"]',
      );

      expect(addUserAction).not.toBeInTheDocument();
    });
  });

  describe('Restore Action', () => {
    it('should only show Restore action when status is ARCHIVED', () => {
      const archive = {
        name: 'test-container',
        status: COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
        objectsCount: 10,
        lockedUntil: null,
      } as TArchiveContainer;

      const { container } = render(<ActionsComponent archive={archive} />);

      const restoreArchiveAction = container.querySelector(
        'ods-button[label="pci_projects_project_storages_cold_archive_container_action_restore"]',
      );
      expect(restoreArchiveAction).toBeVisible();
    });
  });

  describe('Edit Retention Action', () => {
    it.each([
      [COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED, true],
      [COLD_ARCHIVE_CONTAINER_STATUS.RESTORED, true],
    ])('should show Edit Retention action when status is %s', (status) => {
      const archive = {
        name: 'test-container',
        status,
        objectsCount: 10,
        lockedUntil: null,
      } as TArchiveContainer;

      const { container } = render(<ActionsComponent archive={archive} />);

      const editRetentionAction = container.querySelector(
        'ods-button[label="containers:pci_projects_project_storages_cold_archive_container_action_edit_retention"]',
      );
      expect(editRetentionAction).toBeVisible();
    });

    it.each([
      [COLD_ARCHIVE_CONTAINER_STATUS.NONE, false],
      [COLD_ARCHIVE_CONTAINER_STATUS.FLUSHED, false],
    ])('should not show Edit Retention action when status is %s', (status) => {
      const archive = {
        name: 'test-container',
        status,
        objectsCount: 10,
        lockedUntil: null,
      } as TArchiveContainer;

      const { container } = render(<ActionsComponent archive={archive} />);

      const editRetentionAction = container.querySelector(
        'ods-button[label="containers:pci_projects_project_storages_cold_archive_container_action_edit_retention"]',
      );
      expect(editRetentionAction).not.toBeInTheDocument();
    });
  });

  describe('Archive Action', () => {
    it('should show Archive action only when status is NONE and objectsCount > 0', () => {
      const archive = {
        name: 'test-container',
        status: COLD_ARCHIVE_CONTAINER_STATUS.NONE,
        objectsCount: 10,
        lockedUntil: null,
      } as TArchiveContainer;

      const { container } = render(<ActionsComponent archive={archive} />);

      const archiveAction = container.querySelector(
        'ods-button[label="pci_projects_project_storages_cold_archive_container_action_archive"]',
      );
      expect(archiveAction).toBeVisible();
    });

    it('should not show Archive action when objectsCount is 0', () => {
      const archive = {
        name: 'test-container',
        status: COLD_ARCHIVE_CONTAINER_STATUS.NONE,
        objectsCount: 0,
        lockedUntil: null,
      } as TArchiveContainer;

      const { container } = render(<ActionsComponent archive={archive} />);

      const archiveAction = container.querySelector(
        'ods-button[label="pci_projects_project_storages_cold_archive_container_action_archive"]',
      );
      expect(archiveAction).not.toBeInTheDocument();
    });
  });

  describe('Delete Container Action', () => {
    it.each([
      [COLD_ARCHIVE_CONTAINER_STATUS.NONE],
      [COLD_ARCHIVE_CONTAINER_STATUS.FLUSHED],
    ])('should show Delete Container action when status is %s', (status) => {
      const archive = {
        name: 'test-container',
        status,
        objectsCount: 10,
        lockedUntil: null,
      } as TArchiveContainer;

      const { container } = render(<ActionsComponent archive={archive} />);

      const deleteAction = container.querySelector(
        'ods-button[label="pci_projects_project_storages_cold_archive_container_action_delete_container"]',
      );
      expect(deleteAction).toBeVisible();
    });

    it.each([
      [COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED],
      [COLD_ARCHIVE_CONTAINER_STATUS.RESTORED],
    ])(
      'should not show Delete Container action when status is %s',
      (status) => {
        const archive = {
          name: 'test-container',
          status,
          objectsCount: 10,
          lockedUntil: null,
        } as TArchiveContainer;

        const { container } = render(<ActionsComponent archive={archive} />);

        const deleteAction = container.querySelector(
          'ods-button[label="pci_projects_project_storages_cold_archive_container_action_delete_container"]',
        );
        expect(deleteAction).not.toBeInTheDocument();
      },
    );
  });
});
