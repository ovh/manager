import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { AdvancedParameters } from '../AdvancedParameters.component';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { selectFlexBlockData } from '../../view-models/cartViewModel';
import { mockedInstancesCatalogEntity } from '@/__mocks__/instance/constants';
import {
  TInstancesCatalog,
  TRegionalizedFlavor,
} from '@/domain/entities/instancesCatalog';

const useInstancesCatalogWithSelectMock = vi.fn();

vi.mock('@/data/hooks/catalog/useInstancesCatalogWithSelect');
vi.mocked(useInstancesCatalogWithSelect).mockImplementation(
  useInstancesCatalogWithSelectMock,
);

function catalogWithFlexVariant(): TInstancesCatalog {
  const byId = new Map(mockedInstancesCatalogEntity.entities.regionalizedFlavors.byId);
  byId.set('d2-2-flex_GRA-STAGING-A', {
    id: 'd2-2-flex_GRA-STAGING-A',
    hasStock: true,
    quota: 800,
    regionId: 'GRA-STAGING-A',
    flavorId: 'd2-2-flex',
    tags: [],
    osTypes: ['linux', 'windows'],
  } as TRegionalizedFlavor);
  return {
    ...mockedInstancesCatalogEntity,
    entities: {
      ...mockedInstancesCatalogEntity.entities,
      regionalizedFlavors: {
        byId,
        allIds: [...mockedInstancesCatalogEntity.entities.regionalizedFlavors.allIds, 'd2-2-flex_GRA-STAGING-A'],
      },
    },
  };
}

const renderComponent = (options?: {
  catalog?: TInstancesCatalog;
  defaultFlavorId?: string | null;
}) => {
  const catalog = options?.catalog ?? catalogWithFlexVariant();
  const defaultFlavorId = options?.defaultFlavorId ?? 'd2-2_GRA-STAGING-A';

  useInstancesCatalogWithSelectMock.mockReturnValue({
    data: selectFlexBlockData(defaultFlavorId)(catalog),
  });

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{ flavorId: defaultFlavorId }}
    >
      <AdvancedParameters />
    </TestCreateInstanceFormWrapper>,
  );
};

const instanceFlexTitleRegex = /pci_instance_creation_instance_flex_title/i;

function catalogWithoutFlexVariant(): TInstancesCatalog {
  const byId = new Map<string, TRegionalizedFlavor>();
  byId.set('b2-7_GRA11', {
    id: 'b2-7_GRA11',
    hasStock: true,
    quota: 100,
    regionId: 'GRA11',
    flavorId: 'b2-7',
    tags: null,
    osTypes: ['linux'],
  });
  return {
    ...mockedInstancesCatalogEntity,
    entities: {
      ...mockedInstancesCatalogEntity.entities,
      regionalizedFlavors: {
        byId,
        allIds: ['b2-7_GRA11'],
      },
    },
  };
}

describe('AdvancedParameters', () => {
  beforeEach(() => {
    useInstancesCatalogWithSelectMock.mockReturnValue({
      data: selectFlexBlockData('d2-2_GRA-STAGING-A')(
        catalogWithFlexVariant(),
      ),
    });
  });

  it('renders section title and Instance flexible block when flavor has flex variant', async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/pci_instances_creation_advanced_parameters/),
      ).toBeVisible();
      expect(screen.getByLabelText(instanceFlexTitleRegex)).toBeVisible();
    });
    expect(
      screen.getAllByText(/pci_instance_creation_instance_flex_description/)
        .length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('does not render Instance flexible block when flavor has no flex variant', async () => {
    renderComponent({
      catalog: catalogWithoutFlexVariant(),
      defaultFlavorId: 'b2-7_GRA11',
    });

    await waitFor(() => {
      expect(
        screen.getByText(/pci_instances_creation_advanced_parameters/),
      ).toBeVisible();
    });
    expect(screen.queryByLabelText(instanceFlexTitleRegex)).toBeNull();
  });

  it('renders Help link when flex block is visible', async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('common:pci_instances_common_help'),
      ).toBeVisible();
    });
  });

  it('renders Instance flexible checkbox unchecked by default', async () => {
    renderComponent({ defaultFlavorId: 'd2-2_GRA-STAGING-A' });

    await waitFor(() => {
      const checkbox = screen.getByLabelText(instanceFlexTitleRegex);
      expect(checkbox).not.toBeChecked();
    });
  });

  it('renders Instance flexible checkbox checked when flavor is flex', async () => {
    renderComponent({ defaultFlavorId: 'd2-2-flex_GRA-STAGING-A' });

    await waitFor(() => {
      const checkbox = screen.getByLabelText(instanceFlexTitleRegex);
      expect(checkbox).toBeChecked();
    });
  });

  it('checks checkbox and updates form state when clicked', async () => {
    const user = userEvent.setup();
    renderComponent({ defaultFlavorId: 'd2-2_GRA-STAGING-A' });

    const checkbox = screen.getByLabelText(instanceFlexTitleRegex);
    expect(checkbox).not.toBeChecked();

    await act(async () => {
      await user.click(checkbox);
    });

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });
});
