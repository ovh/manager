import { render } from '@testing-library/react';

import { describe, vi } from 'vitest';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { userEvent } from '@testing-library/user-event';
import { useHref } from 'react-router-dom';
import { TAttachedInstance } from '@/api/select/instances';
import { RetypeDetachInstance } from './RetypeDetachInstance.component';
import { useDetachVolume } from '@/api/hooks/useVolume';

vi.mock('@/api/hooks/useVolume', () => ({
  useDetachVolume: vi.fn(),
}));

const BLOCK_LISTING_HREF = '/href-blocks';
vi.mocked(useHref).mockReturnValue(BLOCK_LISTING_HREF);

const PROJECT_ID = 'projectId';
const VOLUME_ID = 'volumeId';

const instance = {
  id: '213',
  name: 'instance',
} as TAttachedInstance;

describe('RetypeDetachInstance', () => {
  beforeEach(() => {
    vi.mocked(useDetachVolume).mockReturnValue(({
      detachVolume: vi.fn(),
      isPending: false,
      isError: false,
    } as unknown) as ReturnType<typeof useDetachVolume>);
  });

  it('should display warning message', () => {
    const { getByText } = render(
      <RetypeDetachInstance
        instance={instance}
        projectId={PROJECT_ID}
        volumeId={VOLUME_ID}
      />,
    );

    expect(
      getByText(
        'retype:pci_projects_project_storages_blocks_retype_detach_volume',
      ),
    ).toBeVisible();
  });

  it('should display confirmation input', () => {
    const { getByText, getByRole } = render(
      <RetypeDetachInstance
        instance={instance}
        projectId={PROJECT_ID}
        volumeId={VOLUME_ID}
      />,
    );

    expect(
      getByText(
        'retype:pci_projects_project_storages_blocks_retype_detach_volume_label',
      ),
    ).toBeVisible();
    expect(getByRole('textbox')).toBeVisible();
  });

  it('should display error message on detach error', () => {
    vi.mocked(useDetachVolume).mockReset();
    vi.mocked(useDetachVolume).mockReturnValue(({
      detachVolume: vi.fn(),
      isPending: false,
      isError: true,
    } as unknown) as ReturnType<typeof useDetachVolume>);

    const { getByText } = render(
      <RetypeDetachInstance
        instance={instance}
        projectId={PROJECT_ID}
        volumeId={VOLUME_ID}
      />,
    );

    expect(
      getByText(
        'pci_projects_project_storages_blocks_retype_detach_volume_error',
      ),
    ).toBeVisible();
  });

  it('should display skeleton while detaching is pending', () => {
    vi.mocked(useDetachVolume).mockReset();
    vi.mocked(useDetachVolume).mockReturnValue(({
      detachVolume: vi.fn(),
      isPending: true,
      isError: false,
    } as unknown) as ReturnType<typeof useDetachVolume>);

    const { getByTestId } = render(
      <RetypeDetachInstance
        instance={instance}
        projectId={PROJECT_ID}
        volumeId={VOLUME_ID}
      />,
    );

    expect(getByTestId('skeleton')).toBeVisible();
  });

  describe('error message', () => {
    it('should not be displayed if input has not been touched', () => {
      const { queryByText } = render(
        <RetypeDetachInstance
          instance={instance}
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
        />,
      );

      expect(queryByText(`${NAMESPACES.FORM}:error_pattern`)).toBeNull();
    });

    it('should not be displayed if input is not valid but not blured', async () => {
      const { queryByText, getByRole } = render(
        <RetypeDetachInstance
          instance={instance}
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'blah');

      expect(queryByText(`${NAMESPACES.FORM}:error_pattern`)).toBeNull();
    });

    it('should be displayed if input is not valid and blurred', async () => {
      const { getByText, getByRole } = render(
        <RetypeDetachInstance
          instance={instance}
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'blah');
      await userEvent.click(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_detach_volume_label',
        ),
      );

      expect(getByText(`${NAMESPACES.FORM}:error_pattern`)).toBeVisible();
    });

    it('should not be displayed if input is valid', async () => {
      const { getByText, queryByText, getByRole } = render(
        <RetypeDetachInstance
          instance={instance}
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'DETACH');
      await userEvent.click(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_detach_volume_label',
        ),
      );

      expect(queryByText(`${NAMESPACES.FORM}:error_pattern`)).toBeNull();
    });
  });

  describe('confirm button', () => {
    it('should be disabled if input is empty', () => {
      const { getByText } = render(
        <RetypeDetachInstance
          instance={instance}
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
        />,
      );

      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_detach_volume_confirm_button',
        ),
      ).toBeDisabled();
    });

    it('should be disabled if input is not valid', async () => {
      const { getByText, getByRole } = render(
        <RetypeDetachInstance
          instance={instance}
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'blah');

      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_detach_volume_confirm_button',
        ),
      ).toBeDisabled();
    });

    it('should be enabled if input is valid', async () => {
      const { getByText, getByRole } = render(
        <RetypeDetachInstance
          instance={instance}
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
        />,
      );

      await userEvent.type(getByRole('textbox'), 'DETACH');
      await userEvent.click(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_detach_volume_label',
        ),
      );

      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_detach_volume_confirm_button',
        ),
      ).toBeEnabled();
    });
  });
});
