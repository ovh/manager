import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import Datastore, {
  breadcrumb as Breadcrumb,
} from '@/pages/dashboard/datastore/Datastore.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import { mockedDatastoreS3WithRegion } from '@/__tests__/helpers/mocks/volume/datastore';

describe('Datastore page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
    vi.mock('@/data/api/ai/data/datastore.api', () => ({
      getDatastores: vi.fn(() => [mockedDatastoreS3WithRegion]),
    }));
    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });
  it('renders and shows buttons in the datastore page', async () => {
    render(<Datastore />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-datastore-button')).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText(mockedDatastoreS3WithRegion.alias),
      ).toBeInTheDocument();
    });
  });

  it('trigger useNavigate on create button click', async () => {
    render(<Datastore />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-datastore-button')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('create-datastore-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });

  it('open delete datastore modal using action table button', async () => {
    render(<Datastore />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedDatastoreS3WithRegion.alias),
      ).toBeInTheDocument();
    });
    await openButtonInMenu(
      'datastore-action-trigger',
      'datastore-action-delete-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `./delete/${mockedDatastoreS3WithRegion.region}/${mockedDatastoreS3WithRegion.alias}`,
    );
  });
});
