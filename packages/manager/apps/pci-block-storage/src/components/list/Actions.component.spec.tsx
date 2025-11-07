import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useHref } from 'react-router-dom';
import ActionsComponent from '@/components/list/Actions.component';
import { TVolume } from '@/api/hooks/useVolume';

vi.mock('@/hooks/useTrackAction', () => ({ useTrackAction: vi.fn() }));

vi.mock('react-router-dom');
const mockVolume = {
  id: '1',
  attachedTo: [],
  canAttachInstance: true,
  canDetachInstance: false,
  canRetype: true,
} as TVolume;

const mockVolumeDetach = {
  id: '1',
  attachedTo: ['attach-1'],
  canAttachInstance: false,
  canDetachInstance: true,
} as TVolume;

vi.mocked(useHref).mockImplementation((value: string) => value);

describe('ActionsComponent', () => {
  it('should render correct buttons with correct links', () => {
    const { getByTestId, queryByTestId } = render(
      <ActionsComponent volume={mockVolume} projectUrl="/project" />,
    );

    expect(getByTestId('actionComponent-create-backup-button')).toHaveAttribute(
      'href',
      '/project/storages/volume-backup/create?volumeId=1',
    );

    expect(getByTestId('actionComponent-remove-button')).toHaveAttribute(
      'href',
      './delete/1',
    );

    expect(getByTestId('actionComponent-attach-button')).toHaveAttribute(
      'href',
      './attach/1',
    );

    expect(queryByTestId('actionComponent-detach-button')).toBeNull();

    expect(getByTestId('actionComponent-retype-button')).toHaveAttribute(
      'href',
      './retype/1',
    );
  });

  it('should render correct buttons with detach link given an instance to detach', () => {
    const { getByTestId, queryByTestId } = render(
      <ActionsComponent volume={mockVolumeDetach} projectUrl="/project" />,
    );

    expect(getByTestId('actionComponent-create-backup-button')).toHaveAttribute(
      'href',
      '/project/storages/volume-backup/create?volumeId=1',
    );

    expect(getByTestId('actionComponent-remove-button')).toHaveAttribute(
      'href',
      './delete/1',
    );

    expect(queryByTestId('actionComponent-attach-button')).toBeNull();

    expect(getByTestId('actionComponent-detach-button')).toHaveAttribute(
      'href',
      './detach/1',
    );

    expect(getByTestId('actionComponent-retype-button')).toHaveAttribute(
      'href',
      './retype/1',
    );
  });

  describe('change type actions', () => {
    it('should be enabled without a title if volume can retype', () => {
      const canRetype = true;

      const { getByTestId } = render(
        <ActionsComponent
          volume={{
            ...mockVolumeDetach,
            canRetype,
          }}
          projectUrl="/project"
        />,
      );

      const changeTypeButton = getByTestId('actionComponent-retype-button');

      expect(changeTypeButton).toBeVisible();
      expect(changeTypeButton).toBeEnabled();
      expect(changeTypeButton).not.toHaveAttribute('title');
    });

    it('should be disabled with a title if volume cant retype', () => {
      const canRetype = false;

      const { getByTestId } = render(
        <ActionsComponent
          volume={{ ...mockVolumeDetach, canRetype }}
          projectUrl="/project"
        />,
      );

      const changeTypeButton = getByTestId('actionComponent-retype-button');

      expect(changeTypeButton).toBeVisible();
      expect(changeTypeButton).toBeDisabled();
      expect(changeTypeButton).toHaveAttribute(
        'title',
        'retype:pci_projects_project_storages_blocks_retype_cant_retype',
      );
    });
  });
});
