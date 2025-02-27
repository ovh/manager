import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedPublicGitVolume } from '@/__tests__/helpers/mocks/volume/volume';
import PublicGit from './PublicGit.component';

describe('Public Git Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Public Git page', async () => {
    render(<PublicGit gitVolumes={[mockedPublicGitVolume]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(
      screen.getByText(mockedPublicGitVolume.mountPath),
    ).toBeInTheDocument();
  });

  it('renders and trigger copy mountpath in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<PublicGit gitVolumes={[mockedPublicGitVolume]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByText(mockedPublicGitVolume.mountPath),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('public-git-copy-mountpath-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedPublicGitVolume.mountPath,
      );
    });
  });
});
