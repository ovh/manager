import { render } from '@testing-library/react';

import { describe, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { Retype } from '@/pages/retype/Retype.component';
import { capitalizeFirstLetter } from '@/utils';

const getSelectedCatalogOption = (encrypted = false) =>
  ({
    name: 'volume model',
    displayName: 'display volume model',
    isPreselected: true,
    capacity: { max: 5 },
    encrypted,
  } as TVolumeRetypeModel);

const getOtherCatalogOption = (encrypted = false) =>
  ({
    name: 'other volume model',
    displayName: 'display other volume model',
    isPreselected: false,
    capacity: { max: 5 },
    encrypted,
  } as TVolumeRetypeModel);

describe('Retype', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('should render volume data with preselection', () => {
    const { getByRole } = render(
      <Retype
        volumeModelData={[getSelectedCatalogOption(), getOtherCatalogOption()]}
      />,
    );

    expect(
      getByRole('radio', {
        name: capitalizeFirstLetter(getSelectedCatalogOption().displayName),
      }),
    ).toBeVisible();
    expect(
      getByRole('radio', {
        name: capitalizeFirstLetter(getSelectedCatalogOption().displayName),
      }),
    ).toBeChecked();
    expect(
      getByRole('radio', {
        name: capitalizeFirstLetter(getOtherCatalogOption().displayName),
      }),
    ).toBeVisible();
    expect(
      getByRole('radio', {
        name: capitalizeFirstLetter(getOtherCatalogOption().displayName),
      }),
    ).not.toBeChecked();
  });

  describe('modify button', () => {
    it('should be disabled if nothing has changed', () => {
      const { getByText } = render(
        <Retype
          volumeModelData={[
            getSelectedCatalogOption(true),
            getOtherCatalogOption(true),
          ]}
        />,
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });

    it('should be enabled if volume type has changed', async () => {
      const { getByText, getByRole } = render(
        <Retype
          volumeModelData={[
            getSelectedCatalogOption(true),
            getOtherCatalogOption(true),
          ]}
        />,
      );

      await userEvent.click(
        getByRole('radio', {
          name: capitalizeFirstLetter(getOtherCatalogOption().displayName),
        }),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).not.toBeDisabled();
    });

    it('should be disabled if volume type has changed and back to original value', async () => {
      const { getByText, getByRole } = render(
        <Retype
          volumeModelData={[
            getSelectedCatalogOption(true),
            getOtherCatalogOption(true),
          ]}
        />,
      );

      await userEvent.click(
        getByRole('radio', {
          name: capitalizeFirstLetter(getOtherCatalogOption().displayName),
        }),
      );
      await userEvent.click(
        getByRole('radio', {
          name: capitalizeFirstLetter(getSelectedCatalogOption().displayName),
        }),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });
  });
});
