import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useToast } from '@datatr-ux/uxlib';
import CliCodeBlock from './CliCodeBlock.component';

const mockedToastMessage = 'cli code have been copy';
describe('CliCodeBlock component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display the CliCodeBlock', async () => {
    render(
      <CliCodeBlock
        title="cli unit test code"
        code="cli code"
        toastMessage={mockedToastMessage}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('cli-code-bloc-container')).toBeInTheDocument();
      expect(screen.getByTestId('code-block-copy-button')).toBeInTheDocument();
      expect(screen.getByTestId('code-block-pre')).toBeInTheDocument();
    });
  });

  it('should copy the cli code', async () => {
    const writeTextMock = vi.fn();
    Object.assign(window.navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <CliCodeBlock
        title="cli unit test code"
        code="cli code"
        toastMessage={mockedToastMessage}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('code-block-copy-button')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('code-block-copy-button'));
    });

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith('cli code');
      expect(useToast().toast).toHaveBeenCalledWith({
        title: mockedToastMessage,
      });
    });
  });
});
