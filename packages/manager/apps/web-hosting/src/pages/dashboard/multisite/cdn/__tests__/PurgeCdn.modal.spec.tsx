import { useLocation } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cdnPropertiesMock } from '@/data/__mocks__/cdn';
import { flushCDNDomainCache, flushCdn } from '@/data/api/cdn';
import { useGetCDNProperties } from '@/data/hooks/cdn/useCdn';
import { CDN_TYPE, CDN_VERSION } from '@/data/types/product/cdn';
import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import PurgeCdnModal from '../PurgeCdn.modal';

vi.mock('@/data/api/cdn', () => ({
  flushCDNDomainCache: vi.fn(),
  flushCdn: vi.fn(),
}));

vi.mock('@/data/hooks/cdn/useCdn', () => ({
  useGetCDNProperties: vi.fn(),
}));

describe('PurgeCdnModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(flushCDNDomainCache).mockResolvedValue({} as never);
    vi.mocked(flushCdn).mockResolvedValue(undefined);

    vi.mocked(useLocation).mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
      key: '',
      state: {
        serviceName: 'test-service',
        domain: 'test-domain.com',
      },
    } as ReturnType<typeof useLocation>);

    vi.mocked(useGetCDNProperties).mockReturnValue({
      data: {
        ...cdnPropertiesMock,
        type: CDN_TYPE.ADVANCED,
        version: CDN_VERSION.CDN_HOSTING,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetCDNProperties>);
  });

  it('should render correctly', () => {
    const { container } = render(<PurgeCdnModal />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should close modal on cancel', () => {
    render(<PurgeCdnModal />, { wrapper });

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('should display domain name', () => {
    render(<PurgeCdnModal />, { wrapper });
    expect(screen.getByText('test-domain.com')).toBeInTheDocument();
  });

  it('should render all purge options for advanced CDN', () => {
    render(<PurgeCdnModal />, { wrapper });

    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(5);
  });

  it('should submit purge with ALL option for CDN V2', async () => {
    render(<PurgeCdnModal />, { wrapper });

    const submitBtn = screen.getByTestId('primary-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(flushCDNDomainCache).toHaveBeenCalledWith('test-service', 'test-domain.com', '');
      expect(navigate).toHaveBeenCalledWith(-1);
    });
  });

  it('should submit purge with pattern for FOLDER option', async () => {
    render(<PurgeCdnModal />, { wrapper });

    const folderRadio = document.querySelector('#option-FOLDER');
    if (folderRadio) {
      fireEvent.click(folderRadio);
    }

    const submitBtn = screen.getByTestId('primary-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(flushCDNDomainCache).toHaveBeenCalled();
      const callArgs = vi.mocked(flushCDNDomainCache).mock.calls[0];
      expect(callArgs[0]).toBe('test-service');
      expect(callArgs[1]).toBe('test-domain.com');
      if (callArgs[2]) {
        expect(callArgs[2]).toContain('patternType=FOLDER');
      }
    });
  });

  it('should use flushCdn for CDN V1', async () => {
    vi.mocked(useGetCDNProperties).mockReturnValue({
      data: {
        ...cdnPropertiesMock,
        type: CDN_TYPE.ADVANCED,
        version: CDN_VERSION.CDN_V1,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetCDNProperties>);

    render(<PurgeCdnModal />, { wrapper });

    const submitBtn = screen.getByTestId('primary-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(flushCdn).toHaveBeenCalledWith('test-service');
      expect(flushCDNDomainCache).not.toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith(-1);
    });
  });

  it('should handle error on purge failure', async () => {
    const error = {
      response: {
        data: {
          message: 'Purge failed',
        },
      },
    };
    vi.mocked(flushCDNDomainCache).mockRejectedValue(error);

    render(<PurgeCdnModal />, { wrapper });

    const submitBtn = screen.getByTestId('primary-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(-1);
    });
  });

  it('should disable submit button while flushing', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise<never>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(flushCDNDomainCache).mockReturnValue(promise);

    render(<PurgeCdnModal />, { wrapper });

    const submitBtn = screen.getByTestId('primary-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });

    resolvePromise({});
    await promise;
  });

  it('should handle option change', () => {
    render(<PurgeCdnModal />, { wrapper });

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[2]);

    expect(radios[2]).toBeChecked();
  });

  it('should handle empty options when CDN properties are not loaded', () => {
    vi.mocked(useGetCDNProperties).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetCDNProperties>);

    render(<PurgeCdnModal />, { wrapper });
    expect(screen.getByTestId('primary-button')).toBeInTheDocument();
  });
});
