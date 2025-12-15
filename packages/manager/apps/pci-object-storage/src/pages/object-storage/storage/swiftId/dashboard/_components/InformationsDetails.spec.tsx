import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import InformationsDetails from './InformationsDetails.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedSwift } from '@/__tests__/helpers/mocks/swift';

vi.mock('@/hooks/useLocaleByteConverter.hook', () => ({
  useLocaleBytesConverter: () => (bytes: number) => `${bytes} bytes`,
}));

const mockRegion: Region = {
  name: 'GRA',
  status: 'UP',
  continentCode: 'EU',
  datacenterLocation: 'Gravelines',
  ipCountries: [],
  services: [
    {
      name: 'storage',
      endpoint: 'https://storage.gra.cloud.ovh.net/v1/AUTH_xxx',
      status: 'UP',
    },
  ],
} as Region;

describe('InformationsDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should build endpoint URL with swiftId appended', () => {
    render(
      <InformationsDetails
        swift={mockedSwift}
        region={mockRegion}
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
        swift={mockedSwift}
        region={mockRegion}
        swiftId="test-swift-id"
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    expect(screen.getByText('1024 bytes')).toBeInTheDocument();
  });
});
