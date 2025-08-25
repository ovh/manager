import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useHref } from 'react-router-dom';
import ActionsComponent from '@/components/list/Actions.component';
import { TVolume } from '@/api/hooks/useVolume';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom');
const mockVolume = {
  id: '1',
  attachedTo: [],
  creationDate: '2022-01-01',
  name: 'Test Volume',
  description: 'This is a test volume',
  size: 100,
  status: 'active',
  statusGroup: 'active',
  region: 'us-west-2',
  bootable: false,
  planCode: 'plan',
  type: 'ssd',
  regionName: 'US West 2',
  availabilityZone: 'any',
  canAttachInstance: true,
  canDetachInstance: false,
  maxAttachedInstances: 1,
} as TVolume;
const mockVolumeDetach = {
  id: '1',
  attachedTo: ['attach-1'],
  creationDate: '2022-01-01',
  name: 'Test Volume',
  description: 'This is a test volume',
  size: 100,
  status: 'active',
  statusGroup: 'active',
  region: 'us-west-2',
  bootable: false,
  planCode: 'plan',
  type: 'ssd',
  regionName: 'US West 2',
  availabilityZone: 'any',
  canAttachInstance: false,
  canDetachInstance: true,
  maxAttachedInstances: 1,
} as TVolume;
describe('ActionsComponent', () => {
  it('ActionsComponent renders correct button with correct links', () => {
    vi.mocked(useHref)
      .mockReturnValueOnce('./edit/1')
      .mockReturnValueOnce('./attach/1')
      .mockReturnValueOnce('./detach/1')
      .mockReturnValueOnce('./delete/1');
    const { getByTestId } = render(
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
  });

  it('ActionsComponent renders correct button with detach link', () => {
    vi.mocked(useHref)
      .mockReturnValueOnce('./edit/1')
      .mockReturnValueOnce('./attach/1')
      .mockReturnValueOnce('./detach/1')
      .mockReturnValueOnce('./delete/1');
    const { getByTestId } = render(
      <ActionsComponent volume={mockVolumeDetach} projectUrl="/project" />,
    );

    expect(getByTestId('actionComponent-detach-button')).toHaveAttribute(
      'href',
      './detach/1',
    );
  });
});
