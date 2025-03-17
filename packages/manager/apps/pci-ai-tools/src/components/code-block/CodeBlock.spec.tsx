import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { describe, it, vi } from 'vitest';
import CodeBlock from './CodeBlock.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

describe('CodeBlock component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display the CodeBlock component', async () => {
    const code = 'console.log("Hello, World!");';
    render(<CodeBlock code={code} />);
    await waitFor(() => {
      expect(screen.getByText(code)).toBeInTheDocument();
    });
  });

  // it('should copy code to clipboard and shows toast message on button click', async () => {
  //   const code = 'console.log("Hello, World!");';
  //   const toastMessage = 'Code copied!';
  //   const mockWriteText = vi.fn();

  //   // Mock navigator.clipboard.writeText
  //   Object.assign(navigator, {
  //     clipboard: {
  //       writeText: mockWriteText,
  //     },
  //   });

  //   render(<CodeBlock code={code} toastMessage={toastMessage} />);

  //   const button = screen.getByTestId('code-block-copy-button');
  //   fireEvent.click(button);

  //   // expect(mockWriteText).toHaveBeenCalledWith(code);
  //   expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(code);
  //   expect(useToast().toast).toHaveBeenCalledWith({ title: toastMessage });
  // });

  it('uses default toast message when none is provided', async () => {
    const code = 'console.log("Hello, World!");';
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(<CodeBlock code={code} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('code-block-copy-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({ title: 'copied' });
    });

    // const button = screen.getByTestId('code-block-copy-button');
    // act(() => {
    //   fireEvent.click(button);
    // });

    // await waitFor(() => {
    //   expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(code);

    // });
  });
});
