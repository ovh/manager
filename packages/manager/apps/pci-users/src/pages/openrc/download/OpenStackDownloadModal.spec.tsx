import { describe, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { useDownloadOpenStackConfig } from '@/api/hooks/useUser';
import OpenStackDownloadModal from './OpenStackDownloadModal';

vi.mock('@/api/hooks/useUser', () => {
  const download = vi.fn(() => {});
  return {
    useDownloadOpenStackConfig: () => ({
      download,
    }),
    useUser: () => ({}),
  };
});

function renderModal() {
  render(
    <QueryClientProvider client={queryClient}>
      <OpenStackDownloadModal
        projectId="foo"
        onClose={() => {}}
        onError={() => {}}
        onSuccess={() => {}}
        userId={'bar'}
      ></OpenStackDownloadModal>
      ,
    </QueryClientProvider>,
  );
}

describe('OpenStack Download Modal', () => {
  it('should call the download function with some parameters', async () => {
    const useDownloadConfig = useDownloadOpenStackConfig({
      projectId: 'foo',
      userId: 'bar',
      onSuccess: () => {},
      onError: () => {},
    });
    renderModal();
    const submitButton = screen.getByTestId('pciModal-button_submit');
    expect(useDownloadConfig.download).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(submitButton);
    });
    const downloadSpy = vi.spyOn(useDownloadConfig, 'download');
    await useDownloadConfig.download('BHS', 3);
    expect(downloadSpy).toHaveBeenCalledWith('BHS', 3);
    expect(downloadSpy).not.toHaveBeenCalledWith('SBG', 2);
    expect(downloadSpy).not.toHaveBeenCalledWith('BHS', 2);
  });
});
