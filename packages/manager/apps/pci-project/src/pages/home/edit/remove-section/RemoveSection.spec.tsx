/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import RemoveSection from './RemoveSection';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof import('react-router-dom') = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ projectId: 'test-project-id' }),
  };
});

const mockUseServiceIds = vi.fn();
vi.mock('@/data/hooks/useServices', () => ({
  useServiceIds: () => mockUseServiceIds(),
}));

describe('RemoveSection', () => {
  it('renders heading and description when not discovery', async () => {
    mockUseServiceIds.mockReturnValue({ data: [123], isPending: false });

    render(<RemoveSection isDiscovery={false} />);

    expect(
      screen.getByText('pci_projects_project_edit_remove_description'),
    ).toBeVisible();
    // Check for heading specifically using test-id and preset
    const odsTexts = screen.getAllByTestId('ods-text');
    const headingText = odsTexts.find(
      (el) => el.getAttribute('data-preset') === 'heading-3',
    );
    expect(headingText).toHaveTextContent('pci_projects_project_edit_remove');
    // Check for button specifically
    expect(screen.getByTestId('remove-section_remove-button')).toBeVisible();
  });

  it('renders only heading when discovery', async () => {
    mockUseServiceIds.mockReturnValue({ data: [123], isPending: false });

    render(<RemoveSection isDiscovery={true} />);

    // Check for heading text using test-id and preset
    const odsTexts = screen.getAllByTestId('ods-text');
    const headingText = odsTexts.find(
      (el) => el.getAttribute('data-preset') === 'heading-3',
    );
    expect(headingText).toHaveTextContent('pci_projects_project_edit_remove');
    expect(
      screen.queryByText('pci_projects_project_edit_remove_description'),
    ).not.toBeInTheDocument();
  });

  it('disables button when serviceIds are loading', async () => {
    mockUseServiceIds.mockReturnValue({ data: undefined, isPending: true });

    render(<RemoveSection isDiscovery={false} />);

    const button = screen.getByTestId('remove-section_remove-button');
    expect(button).toBeDisabled();
  });

  it('disables button when no serviceIds', async () => {
    mockUseServiceIds.mockReturnValue({ data: [], isPending: false });
    render(<RemoveSection isDiscovery={false} />);

    const button = screen.getByTestId('remove-section_remove-button');
    expect(button).toBeDisabled();
  });

  it('navigates to remove page with serviceId on button click', async () => {
    mockUseServiceIds.mockReturnValue({ data: [456], isPending: false });

    render(<RemoveSection isDiscovery={false} />);

    const button = screen.getByTestId('remove-section_remove-button');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('./remove?serviceId=456');
  });
});
