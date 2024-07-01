import { render } from '@testing-library/react';
import DeleteWarningMessage from './DeleteWarningMessage';

describe('DeleteWarningMessage', () => {
  it('renders without crashing', () => {
    const { container } = render(<DeleteWarningMessage />);
    expect(container).toBeTruthy();
  });

  it('renders warning message with correct translation key', () => {
    const { getByText } = render(<DeleteWarningMessage />);
    expect(
      getByText(
        'pci_projects_project_storages_blocks_block_delete_erase_message',
      ),
    ).toBeInTheDocument();
  });
});
