import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { useFetchHubBanner } from '@/data/hooks/banner/useBanner';
import * as BannerApi from '@/data/api/banner';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubBanner', () => {
  it('returns no banner if api returned none', async () => {
    const banner = null;
    const getBanner = vi.spyOn(BannerApi, 'getBanner').mockReturnValue(banner);

    const { result } = renderHook(() => useFetchHubBanner('fr_FR'), {
      wrapper,
    });

    await waitFor(() => {
      expect(getBanner).toHaveBeenCalledWith('fr_FR');
      expect(result.current.data).toEqual(banner);
    });
  });

  it('returns a banner if api returned one', async () => {
    const banner = {
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
      link: 'http://link-to-summit.com',
      tracker: 'summit::tracking',
    };
    vi.spyOn(BannerApi, 'getBanner').mockReturnValue(banner);

    const { result } = renderHook(() => useFetchHubBanner('fr_FR'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(banner);
    });
  });
});
