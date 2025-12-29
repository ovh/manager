import { render } from '@testing-library/react';

import { describe, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { Retype } from '@/pages/retype/Retype.component';
import { capitalizeFirstLetter } from '@/utils';
import { useRetypeVolume } from '@/api/hooks/useVolume';

vi.mock('@/hooks/useTrackBanner');

const retypeMock = vi.fn();
vi.mock('@/api/hooks/useVolume', () => ({
  useRetypeVolume: vi.fn(),
}));
vi.mocked(useRetypeVolume).mockReturnValue(({
  retypeVolume: retypeMock,
} as unknown) as ReturnType<typeof useRetypeVolume>);

const PROJECT_ID = 'PROJECT_ID';
const VOLUME_ID = 'VOLUME_ID';

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

describe('Retype', () => {
  beforeEach(() => {
    vi.mocked(useRetypeVolume).mockReturnValue(({
      retypeVolume: retypeMock,
    } as unknown) as ReturnType<typeof useRetypeVolume>);
  });

  it('should render volume data with preselection', () => {
    const { getByRole } = render(
      <Retype
        projectId={PROJECT_ID}
        volumeId={VOLUME_ID}
        volumeModelData={[selectedCatalogOption, otherCatalogOption]}
      />,
    );

    expect(
      getByRole('radio', {
        name: capitalizeFirstLetter(selectedCatalogOption.displayName),
      }),
    ).toBeVisible();
    expect(
      getByRole('radio', {
        name: capitalizeFirstLetter(selectedCatalogOption.displayName),
      }),
    ).toBeChecked();
    expect(
      getByRole('radio', {
        name: capitalizeFirstLetter(otherCatalogOption.displayName),
      }),
    ).toBeVisible();
    expect(
      getByRole('radio', {
        name: capitalizeFirstLetter(otherCatalogOption.displayName),
      }),
    ).not.toBeChecked();
  });

  describe('modify button', () => {
    it('should be disabled if nothing has changed', () => {
      const { getByText } = render(
        <Retype
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
          volumeModelData={[selectedCatalogOption, otherCatalogOption]}
        />,
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });

    it('should be enabled if volume type has changed', async () => {
      const { getByText, getByRole } = render(
        <Retype
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
          volumeModelData={[selectedCatalogOption, otherCatalogOption]}
        />,
      );

      await userEvent.click(
        getByRole('radio', {
          name: capitalizeFirstLetter(otherCatalogOption.displayName),
        }),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).not.toBeDisabled();
    });

    it('should be disabled if volume type has changed and back to original value', async () => {
      const { getByText, getByRole } = render(
        <Retype
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
          volumeModelData={[selectedCatalogOption, otherCatalogOption]}
        />,
      );

      await userEvent.click(
        getByRole('radio', {
          name: capitalizeFirstLetter(otherCatalogOption.displayName),
        }),
      );
      await userEvent.click(
        getByRole('radio', {
          name: capitalizeFirstLetter(selectedCatalogOption.displayName),
        }),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });
  });

  describe('when retyping', () => {
    it('should call retype volume when confirming', async () => {
      const { getByText, getByRole } = render(
        <Retype
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
          volumeModelData={[selectedCatalogOption, otherCatalogOption]}
        />,
      );

      await userEvent.click(
        getByRole('radio', {
          name: capitalizeFirstLetter(otherCatalogOption.displayName),
        }),
      );
      const confirmButton = getByText(`${NAMESPACES.ACTIONS}:modify`);

      await userEvent.click(confirmButton);

      expect(retypeMock).toHaveBeenCalledWith({
        type: otherCatalogOption.name,
      });
    });

    it('should disable button and inputs', async () => {
      vi.mocked(useRetypeVolume).mockReturnValue(({
        retypeVolume: retypeMock,
        isPending: true,
      } as unknown) as ReturnType<typeof useRetypeVolume>);

      const { getByText, getByRole } = render(
        <Retype
          projectId={PROJECT_ID}
          volumeId={VOLUME_ID}
          volumeModelData={[selectedCatalogOption, otherCatalogOption]}
        />,
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
      expect(
        getByRole('radio', {
          name: capitalizeFirstLetter(selectedCatalogOption.displayName),
        }),
      ).toBeDisabled();
      expect(
        getByRole('radio', {
          name: capitalizeFirstLetter(otherCatalogOption.displayName),
        }),
      ).toBeDisabled();
    });
  });
});
