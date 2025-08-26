import { render } from '@testing-library/react';

import { describe, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import RetypePage from '@/pages/retype/Retype.page';
import {
  TVolumeRetypeModel,
  useCatalogWithPreselection,
} from '@/api/hooks/useCatalogWithPreselection';

const PROJECT_ID = '123';
const VOLUME_ID = '1';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ projectId: PROJECT_ID, volumeId: VOLUME_ID }),
}));

vi.mock('@/api/hooks/useCatalogWithPreselection', () => ({
  useCatalogWithPreselection: vi.fn(),
}));

const selectedCatalogOption = {
  name: 'volume model',
  displayName: 'display volume model',
  isPreselected: true,
  capacity: { max: 5 },
} as TVolumeRetypeModel;

const otherCatalogOption = {
  name: 'other volume model',
  displayName: 'display other volume model',
  isPreselected: false,
  capacity: { max: 5 },
} as TVolumeRetypeModel;

describe('RetypePage', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('should render spinner while fetching', () => {
    vi.mocked(useCatalogWithPreselection).mockReturnValue({
      isPending: true,
    } as ReturnType<typeof useCatalogWithPreselection>);

    const { getByTestId } = render(<RetypePage />);

    expect(useCatalogWithPreselection).toHaveBeenCalledWith(
      PROJECT_ID,
      VOLUME_ID,
    );
    expect(getByTestId('retypePage-loader')).toBeVisible();
  });

  it('should render warning message if data is an empty array', () => {
    vi.mocked(useCatalogWithPreselection).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useCatalogWithPreselection>);

    const { getByText } = render(<RetypePage />);

    expect(useCatalogWithPreselection).toHaveBeenCalledWith(
      PROJECT_ID,
      VOLUME_ID,
    );
    expect(
      getByText(
        'retype:pci_projects_project_storages_blocks_retype_cant_retype',
      ),
    ).toBeVisible();
  });

  describe('validation button', () => {
    it('should be disabled if nothing has changed', () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [selectedCatalogOption, otherCatalogOption],
        isPending: false,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { getByText } = render(<RetypePage />);

      expect(
        getByText(
          'common:pci_projects_project_storages_blocks_button_validate',
        ),
      ).toBeDisabled();
    });

    it('should be enable if volume type has changed', async () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [selectedCatalogOption, otherCatalogOption],
        isPending: false,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { getByText, getByRole } = render(<RetypePage />);

      await userEvent.click(
        getByRole('radio', { name: otherCatalogOption.displayName }),
      );

      expect(
        getByText(
          'common:pci_projects_project_storages_blocks_button_validate',
        ),
      ).not.toBeDisabled();
    });
  });
});
