import '@testing-library/jest-dom';
import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';

import { renderWithShellContext } from '@/__mocks__/ShellContextWrapper';
import Banner from '@/components/banner/Banner.component';
import { useFetchHubBanner } from '@/data/hooks/banner/useBanner';
import { Banner as TBanner } from '@/types/banner.type';

let loading = true;
let banner: TBanner | null = null;
const locale = 'fr_FR';

const trackingSpy = vi.fn();

const shellContext = {
  environment: {
    getUserLocale: () => locale,
  },
};

const renderComponent = () => renderWithShellContext(<Banner />, shellContext as ShellContextType);

vi.mock('@/data/hooks/banner/useBanner', () => ({
  useFetchHubBanner: vi.fn(() => ({
    data: banner,
    isPending: loading,
  })),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackingSpy,
    }),
  };
});

describe('Banner.component', () => {
  it('should not display the banner if none is returned by the api', async () => {
    loading = false;
    const { queryByTestId } = renderComponent();

    expect(queryByTestId('queryByText')).not.toBeInTheDocument();
  });

  it('should call api with user locale', async () => {
    expect(useFetchHubBanner).toHaveBeenCalledWith(locale);
  });

  it('should display the banner if one is returned by the api', async () => {
    banner = {
      alt: 'Summit Banner',
      images: {
        default: {
          src: 'data:image/jpeg;base64,....',
          width: 1250,
          height: 117,
        },
        responsive: {
          src: 'data:image/jpeg;base64,....',
          width: 453,
          height: 117,
        },
      },
      link: 'https://link-to-summit.com',
      tracker: 'summit::tracking',
    };
    const { getByTestId } = renderComponent();

    expect(getByTestId('banner_link')).not.toBeNull();
    expect(getByTestId('banner_image_responsive')).not.toBeNull();
    expect(getByTestId('banner_image')).not.toBeNull();
  });

  it('should track any click on the banner', async () => {
    const { getByTestId } = renderComponent();

    const link = getByTestId('banner_link');
    await act(() => fireEvent.click(link));

    expect(trackingSpy).toHaveBeenCalled();
  });
});
