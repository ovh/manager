import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import OrderSummary from './OrderSummary.component';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { mockedCapabilitiesFlavorCPU } from '@/__tests__/helpers/mocks/capabilities/flavor';
import { mockedEditor } from '@/__tests__/helpers/mocks/capabilities/notebookEditor';
import { mockedOrderVolumesS3 } from '@/__tests__/helpers/mocks/volume/datastore';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedFramework } from '@/__tests__/helpers/mocks/capabilities/notebookFramework';

const mockedOrder = {
  region: mockedCapabilitiesRegionGRA,
  flavor: mockedCapabilitiesFlavorCPU,
  resourcesQuantity: 2,
  framework: mockedFramework,
  version: 'version',
  editor: mockedEditor,
  notebookName: 'myNotebook',
  unsecureHttp: false,
  labels: { test: 'test' },
  sshKey: ['myNewSSHKEY'],
  volumes: [mockedOrderVolumesS3],
};

describe('Order summary', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('order summary click link display section', async () => {
    const mockedOnSectionClicked = vi.fn();
    render(
      <OrderSummary
        order={mockedOrder}
        onSectionClicked={mockedOnSectionClicked}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByText(mockedOrder.notebookName)).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('name-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('name');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('region-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('region');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('flavor-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('flavor');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('framework-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('framework');
    });

    act(() => {
      fireEvent.click(screen.getByTestId('editor-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('editor');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('access-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('access');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('volumes-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('volumes');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('labels-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('labels');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('sshKeys-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('sshKey');
    });
  });
});
