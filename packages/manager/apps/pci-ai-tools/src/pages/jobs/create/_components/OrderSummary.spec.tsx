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
import { mockedOrderVolumesS3 } from '@/__tests__/helpers/mocks/volume/datastore';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedPresetImage } from '@/__tests__/helpers/mocks/job/presetImage';

const mockedOrder = {
  region: mockedCapabilitiesRegionGRA,
  flavor: mockedCapabilitiesFlavorCPU,
  image: mockedPresetImage.id,
  resourcesQuantity: 2,
  jobName: 'myJob',
  unsecureHttp: false,
  dockerCommand: ['run', 'docker'],
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
      expect(screen.getByText(mockedOrder.jobName)).toBeTruthy();
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
      fireEvent.click(screen.getByTestId('image-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('image');
    });

    act(() => {
      fireEvent.click(screen.getByTestId('access-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('access');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('dockerCommand-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('dockerCommand');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('volumes-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('volumes');
    });
    // act(() => {
    //   fireEvent.click(screen.getByTestId('labels-section-button'));
    // });
    // await waitFor(() => {
    //   expect(mockedOnSectionClicked).toHaveBeenCalledWith('labels');
    // });
    act(() => {
      fireEvent.click(screen.getByTestId('sshKeys-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('sshKey');
    });
  });
});
