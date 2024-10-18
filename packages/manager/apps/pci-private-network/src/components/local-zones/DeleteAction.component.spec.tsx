import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useHref } from 'react-router-dom';
import DeleteAction from '@/components/local-zones/DeleteAction.component';

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
}));

describe('DeleteAction', () => {
  it('should render delete button with correct href', () => {
    vi.mocked(useHref).mockReturnValue('mocked_href');

    const { getByTestId } = render(
      <DeleteAction networkId="mocked_networkId" region="mocked_region" />,
    );
    const deleteButton = getByTestId('DeleteAction-deleteButton');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('href', 'mocked_href');
  });

  it('should render tooltip with correct text', () => {
    render(
      <DeleteAction networkId="mocked_networkId" region="mocked_region" />,
    );
    const tooltip = screen.getByText(
      'pci_projects_project_network_private_delete',
    );
    expect(tooltip).toBeInTheDocument();
  });
});
