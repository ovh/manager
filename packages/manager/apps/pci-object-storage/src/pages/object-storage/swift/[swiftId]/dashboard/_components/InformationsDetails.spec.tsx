import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import InformationsDetails from './InformationsDetails.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';
import cloud from '@/types/Cloud';

vi.mock('@/hooks/useLocaleByteConverter.hook', () => ({
  useLocaleBytesConverter: () => (bytes: number) => `${bytes} bytes`,
}));

const regionWithStorageService: cloud.Region = {
  ...mockedRegion,
  services: [
    {
      endpoint: 'https://storage.gra.cloud.ovh.net/v1/AUTH_xxx',
      name: 'storage',
      status: cloud.ServiceStatusEnum.UP,
    },
  ],
};

describe('InformationsDetails', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', swiftId: 'test-swift-id' });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should build endpoint URL with swiftId appended', () => {
    render(
      <InformationsDetails
        swift={mockedContainerDetail}
        region={regionWithStorageService}
        swiftId="my-container-id"
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes[0]).toHaveTextContent(
      'https://storage.gra.cloud.ovh.net/v1/AUTH_xxx/my-container-id',
    );
  });

  it('should display formatted storage size', () => {
    render(
      <InformationsDetails
        swift={mockedContainerDetail}
        region={regionWithStorageService}
        swiftId="test-swift-id"
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    expect(
      screen.getByText(`${mockedContainerDetail.storedBytes} bytes`),
    ).toBeInTheDocument();
  });

  it('should navigate to delete route when delete button is clicked', () => {
    render(
      <InformationsDetails
        swift={mockedContainerDetail}
        region={regionWithStorageService}
        swiftId="test-swift-id"
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    fireEvent.click(screen.getByTestId('swift-container-delete-button'));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete');
  });
});
