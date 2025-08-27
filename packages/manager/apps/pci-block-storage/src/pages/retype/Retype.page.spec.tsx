import { render, within } from '@testing-library/react';

import { describe, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
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

  it('should render unavailable message message if selected volume is not encrypted', () => {
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

  describe('modify button', () => {
    it('should be disabled if nothing has changed', () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [selectedCatalogOption, otherCatalogOption],
        isPending: false,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { getByText } = render(<RetypePage />);

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });

    it('should be enabled if volume type has changed', async () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [selectedCatalogOption, otherCatalogOption],
        isPending: false,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { getByText, getByRole } = render(<RetypePage />);

      await userEvent.click(
        getByRole('radio', { name: otherCatalogOption.displayName }),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).not.toBeDisabled();
    });

    it('should be disabled if volume type has changed and back to original value', async () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [selectedCatalogOption, otherCatalogOption],
        isPending: false,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { getByText, getByRole } = render(<RetypePage />);

      await userEvent.click(
        getByRole('radio', { name: otherCatalogOption.displayName }),
      );
      await userEvent.click(
        getByRole('radio', { name: selectedCatalogOption.displayName }),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });

    it('should be enabled if encryption has changed', async () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [
          {
            ...selectedCatalogOption,
            encrypted: true,
          },
        ],
        isPending: false,
        preselectedEncryptionType: null,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { getByRole, getByText } = render(<RetypePage />);

      await userEvent.click(
        within(
          getByRole('radiogroup', {
            name:
              'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
          }),
        ).getByText('OVHcloud Managed Key'),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).not.toBeDisabled();
    });

    it('should be disabled if encryption has changed and back to original value', async () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [
          {
            ...selectedCatalogOption,
            encrypted: true,
          },
        ],
        isPending: false,
        preselectedEncryptionType: null,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { getByRole, getByText } = render(<RetypePage />);

      await userEvent.click(
        within(
          getByRole('radiogroup', {
            name:
              'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
          }),
        ).getByText('OVHcloud Managed Key'),
      );
      await userEvent.click(
        within(
          getByRole('radiogroup', {
            name:
              'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
          }),
        ).getByText('common:pci_projects_project_storages_blocks_status_NONE'),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });
  });

  describe('encryption', () => {
    it('should render option given volume is encrypted', () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [
          {
            ...selectedCatalogOption,
            encrypted: true,
          },
        ],
        isPending: false,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { getByRole, queryByText } = render(<RetypePage />);

      expect(
        getByRole('radiogroup', {
          name:
            'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
        }),
      ).toBeVisible();
      expect(
        queryByText(
          'retype:pci_projects_project_storages_blocks_retype_encryption_not_available',
        ),
      ).toBeNull();
    });

    it('should not render option given and render information message given volume is not encrypted', () => {
      vi.mocked(useCatalogWithPreselection).mockReturnValue({
        data: [
          {
            ...selectedCatalogOption,
            encrypted: false,
          },
        ],
        isPending: false,
      } as ReturnType<typeof useCatalogWithPreselection>);

      const { queryByRole, getByText } = render(<RetypePage />);

      expect(
        queryByRole('radiogroup', {
          name:
            'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
        }),
      ).toBeNull();
      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_encryption_not_available',
        ),
      ).toBeVisible();
    });
  });
});
