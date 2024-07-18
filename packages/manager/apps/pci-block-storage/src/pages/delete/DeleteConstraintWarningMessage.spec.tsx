import { render } from '@testing-library/react';
import DeleteConstraintWarningMessage from './DeleteConstraintWarningMessage';

describe('DeleteConstraintWarningMessage', () => {
  it('renders nothing when hasSnapshot and isAttached are false', () => {
    const { container } = render(
      <DeleteConstraintWarningMessage hasSnapshot={false} isAttached={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders snapshot error message when hasSnapshot is true and isAttached is false', () => {
    const { getByText } = render(
      <DeleteConstraintWarningMessage hasSnapshot isAttached={false} />,
    );
    expect(
      getByText(
        'pci_projects_project_storages_blocks_block_delete_error_should_snapshots',
      ),
    ).toBeInTheDocument();
  });

  it('renders detach error message when hasSnapshot is false and isAttached is true', () => {
    const { getByText } = render(
      <DeleteConstraintWarningMessage hasSnapshot={false} isAttached />,
    );
    expect(
      getByText(
        'pci_projects_project_storages_blocks_block_delete_error_should_detach',
      ),
    ).toBeInTheDocument();
  });

  it('renders multiple error messages when hasSnapshot and isAttached are true', () => {
    const { getByText } = render(
      <DeleteConstraintWarningMessage hasSnapshot isAttached />,
    );
    expect(
      getByText(
        'pci_projects_project_storages_blocks_block_delete_error_should_multiple',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        'pci_projects_project_storages_blocks_block_delete_error_detach',
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        'pci_projects_project_storages_blocks_block_delete_error_delete_snapshots',
      ),
    ).toBeInTheDocument();
  });
});
