import { TRegion } from '@ovh-ux/manager-react-components';
import { UseQueryResult } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as _useRegionHook from '../../api/hook/useRegions';
import SelectS3StorageRegions from './SelectS3StorageRegions';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useTranslatedMicroRegions: () => ({
    translateMicroRegion: (region: string) => `Translated ${region}`,
  }),
}));

describe('S3StorageRegions Component', () => {
  const mockOnS3StorageRegionChange = vi.fn();

  const renderComponent = (projectId = 'test-project') =>
    render(
      <SelectS3StorageRegions
        projectId={projectId}
        onS3StorageRegionChange={mockOnS3StorageRegionChange}
      />,
    );

  it('renders the select component with regions', () => {
    vi.spyOn(_useRegionHook, 'useS3StorageRegions').mockReturnValue({
      data: [{ name: 'GRA' }, { name: 'BHS' }, { name: 'SBG' }],
      isLoading: false,
    } as UseQueryResult<TRegion[], Error>);

    renderComponent();

    const selectElement = screen.getByTestId('regions_select');
    expect(selectElement).toBeVisible();

    const graRegion = screen.getByText('Translated GRA');
    const bhsRegion = screen.getByText('Translated BHS');
    const sbgRegion = screen.getByText('Translated SBG');

    expect(graRegion).toBeInTheDocument();
    expect(bhsRegion).toBeInTheDocument();
    expect(sbgRegion).toBeInTheDocument();
  });

  it('sets initial region to first region in the list', () => {
    vi.spyOn(_useRegionHook, 'useS3StorageRegions').mockReturnValue({
      data: [{ name: 'GRA' }, { name: 'BHS' }, { name: 'SBG' }],
      isLoading: false,
    } as UseQueryResult<TRegion[], Error>);

    renderComponent();

    const selectElement = screen.getByTestId(
      'regions_select',
    ) as HTMLOdsSelectElement;

    expect(selectElement.defaultValue).toBe('GRA');
  });

  it('shows spinner when loading', () => {
    vi.spyOn(_useRegionHook, 'useS3StorageRegions').mockReturnValue({
      data: [],
      isLoading: true,
    } as UseQueryResult<TRegion[], Error>);

    renderComponent();

    const spinner = screen.getByTestId('s3StorageRegions_spinner');
    expect(spinner).toBeVisible();
  });

  it('calls onS3StorageRegionChange with initial region', async () => {
    vi.spyOn(_useRegionHook, 'useS3StorageRegions').mockReturnValue({
      data: [{ name: 'GRA' }, { name: 'BHS' }, { name: 'SBG' }],
      isLoading: false,
    } as UseQueryResult<TRegion[], Error>);

    renderComponent();

    await waitFor(() => {
      expect(mockOnS3StorageRegionChange).toHaveBeenCalledWith('GRA');
    });
  });
});
