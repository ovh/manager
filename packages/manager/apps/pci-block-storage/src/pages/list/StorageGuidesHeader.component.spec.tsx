import { StorageGuidesHeader } from './StorageGuidesHeader.component';
import { renderWithShellAndQueryClient } from '@/__tests__/renderWithShellAndQueryClient';

describe('StorageGuidesHeader', () => {
  it('should renders', () => {
    const { getByText } = renderWithShellAndQueryClient(
      <StorageGuidesHeader />,
    );

    expect(
      getByText('pci_projects_project_storages_blocks_guides_header'),
    ).toBeInTheDocument();
    expect(
      getByText(
        'pci_projects_project_storages_blocks_guides_all_block_storage_guides',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        'pci_projects_project_storages_blocks_guides_first_steps_with_volumes',
      ),
    ).toBeInTheDocument();
  });
});
