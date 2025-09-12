import { render } from '@testing-library/react';

import { describe, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import RetypePage from './Retype.page';
import {
  TVolumeRetypeModel,
  useCatalogWithPreselection,
} from '@/api/hooks/useCatalogWithPreselection';
import { useAttachedInstances } from '@/api/hooks/useInstance';
import { TAttachedInstance } from '@/api/select/instances';

const PROJECT_ID = '123';
const VOLUME_ID = '1';

vi.mock('@/api/hooks/useCatalogWithPreselection', () => ({
  useCatalogWithPreselection: vi.fn(),
}));

vi.mock('@/api/hooks/useInstance', () => ({
  useAttachedInstances: vi.fn(),
}));

vi.mock('./Retype.component', () => ({
  Retype: () => <div>Retype instance</div>,
}));

vi.mock('./RetypeDetachInstance.component', () => ({
  RetypeDetachInstance: () => <div>Detach instance</div>,
}));

vi.mocked(useParams).mockReturnValue({
  projectId: PROJECT_ID,
  volumeId: VOLUME_ID,
});

const volumeRetypeModel = {
  name: 'volume model',
  displayName: 'display volume model',
  isPreselected: true,
  capacity: { max: 5 },
} as TVolumeRetypeModel;

const instance = {
  id: '213',
  name: 'instance',
} as TAttachedInstance;

describe('RetypePage', () => {
  it('should render spinner while fetching volumeRetypeModel', () => {
    vi.mocked(useCatalogWithPreselection).mockReturnValue({
      isPending: true,
    } as ReturnType<typeof useCatalogWithPreselection>);

    vi.mocked(useAttachedInstances).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useAttachedInstances>);

    const { getByTestId, queryByText } = render(<RetypePage />);

    expect(getByTestId('retypePage-loader')).toBeVisible();
    expect(
      queryByText(
        'retype:pci_projects_project_storages_blocks_retype_cant_retype',
      ),
    ).toBeNull();
    expect(queryByText('Detach instance')).toBeNull();
    expect(queryByText('Retype instance')).toBeNull();
  });

  it('should render spinner while fetching instances', () => {
    vi.mocked(useCatalogWithPreselection).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useCatalogWithPreselection>);

    vi.mocked(useAttachedInstances).mockReturnValue({
      isPending: true,
    } as ReturnType<typeof useAttachedInstances>);

    const { getByTestId, queryByText } = render(<RetypePage />);

    expect(getByTestId('retypePage-loader')).toBeVisible();
    expect(
      queryByText(
        'retype:pci_projects_project_storages_blocks_retype_cant_retype',
      ),
    ).toBeNull();
    expect(queryByText('Detach instance')).toBeNull();
    expect(queryByText('Retype instance')).toBeNull();
  });

  it('should render warning message if volumeRetypeModel data is an empty array', () => {
    vi.mocked(useCatalogWithPreselection).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useCatalogWithPreselection>);

    vi.mocked(useAttachedInstances).mockReturnValue({
      data: [instance],
      isPending: false,
    } as ReturnType<typeof useAttachedInstances>);

    const { getByText, queryByText, queryByTestId } = render(<RetypePage />);

    expect(
      getByText(
        'retype:pci_projects_project_storages_blocks_retype_cant_retype',
      ),
    ).toBeVisible();
    expect(queryByTestId('retypePage-loader')).toBeNull();
    expect(queryByText('Detach instance')).toBeNull();
    expect(queryByText('Retype instance')).toBeNull();
  });

  it('should render RetypeDetachInstance if there is an instance', () => {
    vi.mocked(useCatalogWithPreselection).mockReturnValue({
      data: [volumeRetypeModel],
      isPending: false,
    } as ReturnType<typeof useCatalogWithPreselection>);

    vi.mocked(useAttachedInstances).mockReturnValue({
      data: [instance],
      isPending: false,
    } as ReturnType<typeof useAttachedInstances>);

    const { getByText, queryByText, queryByTestId } = render(<RetypePage />);

    expect(getByText('Detach instance')).toBeVisible();
    expect(
      queryByText(
        'retype:pci_projects_project_storages_blocks_retype_cant_retype',
      ),
    ).toBeNull();
    expect(queryByTestId('retypePage-loader')).toBeNull();
    expect(queryByText('Retype instance')).toBeNull();
  });

  it('should render Retype if there is no instance and a volumeRetypeModel', () => {
    vi.mocked(useCatalogWithPreselection).mockReturnValue({
      data: [volumeRetypeModel],
      isPending: false,
    } as ReturnType<typeof useCatalogWithPreselection>);

    vi.mocked(useAttachedInstances).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useAttachedInstances>);

    const { getByText, queryByText, queryByTestId } = render(<RetypePage />);

    expect(getByText('Retype instance')).toBeVisible();
    expect(
      queryByText(
        'retype:pci_projects_project_storages_blocks_retype_cant_retype',
      ),
    ).toBeNull();
    expect(queryByTestId('retypePage-loader')).toBeNull();
    expect(queryByText('Detach instance')).toBeNull();
  });
});
