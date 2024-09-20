import React from 'react';
import { vi, describe, expect, it, afterEach } from 'vitest';
import ModalAddAndEditRedirections from '../ModalAddAndEditRedirections.page';
import { render, fireEvent, screen } from '@/utils/test.provider';

vi.mock('@/hooks', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useGenerateUrl: vi.fn(() => '#/redirections'),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('ModalAddAndEditRedirections Component', () => {
  it('should render correctly', () => {
    render(<ModalAddAndEditRedirections />);

    expect(screen.getByTestId('field-from')).toBeInTheDocument();
    expect(screen.getByTestId('field-to')).toBeInTheDocument();
    expect(screen.getByTestId('field-checkbox')).toBeInTheDocument();

    const confirmButton = screen.getByTestId('confirm-btn');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  it('should enable the confirm button when form is valid', () => {
    render(<ModalAddAndEditRedirections />);

    fireEvent.change(screen.getByTestId('input-from'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByTestId('input-to'), {
      target: { value: 'test2@example.com' },
    });

    fireEvent.click(screen.getByTestId('field-checkbox'));

    const confirmButton = screen.getByTestId('confirm-btn');
    expect(confirmButton).toBeDisabled();
  });
});
