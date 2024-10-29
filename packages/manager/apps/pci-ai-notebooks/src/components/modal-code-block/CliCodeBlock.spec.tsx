/*
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useToast } from '@/components/ui/use-toast';
import CodeBlock from './CliCodeBlock.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
vi.mock('@/components/ui/use-toast', () => {
  const toastMock = vi.fn();
  return {
    useToast: vi.fn(() => ({
      toast: toastMock,
    })),
  };
});

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

  it('should copy code to clipboard and shows toast message on button click', async () => {
    const code = 'console.log("Hello, World!");';
    const toastMessage = 'Code copied!';
    const mockToast = { toast: vi.fn() };
    const mockWriteText = vi.fn();

    // Mock useTranslation and useToast hooks
    (useToast as any).mockReturnValue(mockToast);

    // Mock navigator.clipboard.writeText
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<CodeBlock code={code} toastMessage={toastMessage} />);

    const button = screen.getByTestId('code-block-copy-button');
    fireEvent.click(button);

    expect(mockWriteText).toHaveBeenCalledWith(code);
    expect(mockToast.toast).toHaveBeenCalledWith({ title: toastMessage });
  });

  it('uses default toast message when none is provided', async () => {
    const code = 'console.log("Hello, World!");';
    const mockToast = { toast: vi.fn() };
    const mockWriteText = vi.fn();

    // Mock useTranslation and useToast hooks
    (useToast as any).mockReturnValue(mockToast);

    // Mock navigator.clipboard.writeText
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<CodeBlock code={code} />);

    const button = screen.getByTestId('code-block-copy-button');
    fireEvent.click(button);

    expect(mockWriteText).toHaveBeenCalledWith(code);
    expect(mockToast.toast).toHaveBeenCalledWith({ title: 'copied' });
  });
});
*/
