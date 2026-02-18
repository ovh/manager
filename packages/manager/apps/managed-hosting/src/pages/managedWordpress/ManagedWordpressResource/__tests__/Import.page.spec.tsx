import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CommonTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/tests/test.provider';
import { navigate } from '@/utils/tests/test.setup';

import ImportPage from '../import/Import.page';

const mockUseManagedCmsLatestPhpVersion = vi.fn();

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressReferenceSupportedPHPVersions/managedWordpressReferenceSupportedPHPVersions',
  () => ({
    useManagedCmsLatestPhpVersion: () =>
      mockUseManagedCmsLatestPhpVersion() as {
        data: string[] | undefined | null;
        isLoading: boolean;
        isError: boolean;
      },
  }),
);

describe.skip('ImportPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseManagedCmsLatestPhpVersion.mockReturnValue({
      data: ['8.0', '8.1', '8.2'],
      isLoading: false,
      isError: false,
    });
  });

  it('should render correctly', () => {
    render(<ImportPage />, { wrapper });
    expect(screen.getByText(CommonTranslations.import_website)).toBeInTheDocument();
  });

  it('should display the last PHP version when data is available', () => {
    render(<ImportPage />, { wrapper });
    expect(
      screen.getByText('web_hosting_managed_wordpress_import_last_php_version'),
    ).toBeInTheDocument();
  });

  it('should handle empty data array', () => {
    mockUseManagedCmsLatestPhpVersion.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    render(<ImportPage />, { wrapper });
    expect(screen.getByText(CommonTranslations.import_website)).toBeInTheDocument();
  });

  it('should handle undefined data', () => {
    mockUseManagedCmsLatestPhpVersion.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
    render(<ImportPage />, { wrapper });
    expect(screen.getByText(CommonTranslations.import_website)).toBeInTheDocument();
  });

  it('should handle non-array data', () => {
    mockUseManagedCmsLatestPhpVersion.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    render(<ImportPage />, { wrapper });
    expect(screen.getByText(CommonTranslations.import_website)).toBeInTheDocument();
  });

  it('should navigate back when clicking on back link', () => {
    render(<ImportPage />, { wrapper });
    const backLink = screen.getByText(CommonTranslations.web_hosting_common_sites_backpage);
    fireEvent.click(backLink);
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
