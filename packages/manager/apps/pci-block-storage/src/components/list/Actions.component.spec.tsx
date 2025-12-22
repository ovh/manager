import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useHref } from 'react-router-dom';
import ActionsComponent from '@/components/list/Actions.component';
import { TVolume } from '@/api/hooks/useVolume';

vi.mock('@/hooks/useTrackAction', () => ({ useTrackAction: vi.fn() }));

vi.mock('react-router-dom');
const volumeThatCanDoEverything = {
  id: '1221',
  canAttachInstance: true,
  canDetachInstance: true,
  canRetype: true,
  status: 'available',
} as TVolume;

vi.mocked(useHref).mockImplementation((value: string) => value);

describe('ActionsComponent', () => {
  describe('visible actions', () => {
    const translationLabelPrefix = 'pci_projects_project_storages_blocks_';
    const allActionsLabel = [
      'edit_label',
      `instance_attach_label`,
      `instance_detach_label`,
      'create_backup_label',
      'change_type',
      'delete_label',
    ];

    it.each([
      {
        description: 'volume is available and can do every action',
        volume: {
          canRetype: true,
          canDetachInstance: true,
          canAttachInstance: true,
          status: 'available',
        } as TVolume,
        hiddenActions: [],
      },
      {
        description: 'volume is available and cant retype',
        volume: {
          canRetype: false,
          canDetachInstance: true,
          canAttachInstance: true,
          status: 'available',
        } as TVolume,
        hiddenActions: [],
      },
      {
        description: 'volume is available and cant detach instance',
        volume: {
          canRetype: true,
          canDetachInstance: false,
          canAttachInstance: true,
          status: 'available',
        } as TVolume,
        hiddenActions: ['instance_detach_label'],
      },
      {
        description: 'volume is available and cant attach instance',
        volume: {
          canRetype: true,
          canDetachInstance: true,
          canAttachInstance: false,
          status: 'available',
        } as TVolume,
        hiddenActions: ['instance_attach_label'],
      },
      {
        description: 'volume is being retyped',
        volume: {
          canRetype: true,
          canDetachInstance: true,
          canAttachInstance: true,
          status: 'retyping',
        } as TVolume,
        hiddenActions: ['create_backup_label', 'change_type', 'delete_label'],
      },
    ])(
      'expect $hiddenActions not to be visible when $description',
      ({ volume, hiddenActions }) => {
        const { getByText, queryByText } = render(
          <ActionsComponent volume={volume} projectUrl="/project" />,
        );

        allActionsLabel.forEach((possibleAction) => {
          if (hiddenActions.includes(possibleAction)) {
            expect(
              queryByText(`${translationLabelPrefix}${possibleAction}`),
            ).toBeNull();
          } else {
            expect(
              getByText(`${translationLabelPrefix}${possibleAction}`),
            ).toBeVisible();
          }
        });
      },
    );
  });

  it('should render correct buttons with correct links', () => {
    const { getByTestId } = render(
      <ActionsComponent
        volume={volumeThatCanDoEverything}
        projectUrl="/project"
      />,
    );

    expect(getByTestId('actionComponent-edit-button')).toHaveAttribute(
      'href',
      './1221/edit',
    );

    expect(getByTestId('actionComponent-attach-button')).toHaveAttribute(
      'href',
      './attach/1221',
    );

    expect(getByTestId('actionComponent-detach-button')).toHaveAttribute(
      'href',
      './detach/1221',
    );

    expect(getByTestId('actionComponent-create-backup-button')).toHaveAttribute(
      'href',
      '/project/storages/volume-backup/create?volumeId=1221',
    );

    expect(getByTestId('actionComponent-retype-button')).toHaveAttribute(
      'href',
      './retype/1221',
    );

    expect(getByTestId('actionComponent-remove-button')).toHaveAttribute(
      'href',
      './delete/1221',
    );
  });

  describe('retyping action', () => {
    it('should be enabled without a title if volume can retype', () => {
      const { getByTestId } = render(
        <ActionsComponent
          volume={{ canRetype: true } as TVolume}
          projectUrl="/project"
        />,
      );

      const changeTypeButton = getByTestId('actionComponent-retype-button');

      expect(changeTypeButton).toBeVisible();
      expect(changeTypeButton).toBeEnabled();
      expect(changeTypeButton).not.toHaveAttribute('title');
    });

    it('should be disabled with a title if volume cant retype', () => {
      const { getByTestId } = render(
        <ActionsComponent
          volume={{ canRetype: false } as TVolume}
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
