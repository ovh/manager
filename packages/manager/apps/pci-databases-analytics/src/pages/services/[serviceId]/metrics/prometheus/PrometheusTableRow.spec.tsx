import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import PrometheusTableRow from './PrometheusTableRow.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@datatr-ux/uxlib', async () => {
  const mod = await vi.importActual('@datatr-ux/uxlib');
  const toastMock = vi.fn();
  return {
    ...mod,
    useToast: vi.fn(() => ({
      toast: toastMock,
    })),
  };
});
describe('PrometheusTableRow', () => {
  const name = 'exampleName';
  const value = 'exampleValue';
  const writeTextMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render table row with name and value', () => {
    render(<PrometheusTableRow name={name} value={value} />);

    expect(screen.getByText(`${name}Label`)).toBeInTheDocument();
    expect(screen.getByTitle(value)).toBeInTheDocument();
  });

  it('should copy value to clipboard when copy button is clicked', async () => {
    const { toast } = useToast();

    render(<PrometheusTableRow name={name} value={value} />);

    const copyButton = screen.getByTestId(`prometheus-copy-${name}-button`);
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(value);
      expect(toast).toHaveBeenCalledWith({
        title: 'copiedToastMessage',
      });
    });
  });

  it('should display truncated value with tooltip', () => {
    render(<PrometheusTableRow name={name} value={value} />);

    const valueElement = screen.getByTitle(value);
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveClass('truncate');
  });
});
