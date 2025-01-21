import { describe, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import RCloneDownloadModal from './RCloneDownloadModal';
import { useDownloadRCloneConfig } from '@/api/hooks/useUser';

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  useEnvironment: () => ({
    user: {},
    getUser: () => ({}),
  }),
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

vi.mock('@/api/hooks/useUser', () => {
  const download = vi.fn(() => {});
  return {
    useDownloadRCloneConfig: () => ({
      download,
    }),
    useUser: () => ({}),
  };
});

function renderModal() {
  render(
    <QueryClientProvider client={queryClient}>
      <RCloneDownloadModal
        projectId="foo"
        onClose={() => {}}
        onError={() => {}}
        onSuccess={() => {}}
        userId={'bar'}
      ></RCloneDownloadModal>
      ,
    </QueryClientProvider>,
  );
}

describe('Rclone Download Modal', () => {
  it('should call the download function with some parameters', async () => {
    const useDownloadConfig = useDownloadRCloneConfig({
      projectId: 'foo',
      userId: 'bar',
      onSuccess: () => {},
      onError: () => {},
    });
    renderModal();
    const submitButton = screen.getByTestId('submitButton');
    expect(useDownloadConfig.download).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(submitButton);
    });
    const downloadSpy = vi.spyOn(useDownloadConfig, 'download');
    await useDownloadConfig.download('BHS', 'Swift');
    expect(downloadSpy).toHaveBeenCalledWith('BHS', 'Swift');
    expect(downloadSpy).not.toHaveBeenCalledWith('SBG', 'S3');
  });
});
