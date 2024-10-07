import React from 'react';
import { vi, describe, expect, it, afterEach } from 'vitest';
import ModalDeleteRedirections from '../ModalDeleteRedirections.component';
import { render, fireEvent, screen } from '@/utils/test.provider';

vi.mock('@/hooks', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('ModalDeleteRedirections Component', () => {
  it('should render correctly', () => {
    render(<ModalDeleteRedirections />);
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
    expect(screen.getByTestId('delete-btn')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('cancel-btn');
    const deleteButton = screen.getByTestId('delete-btn');

    expect(cancelButton).not.toBeDisabled();
    expect(deleteButton).not.toBeDisabled();
  });

  it('should trigger the correct action on cancel', () => {
    render(<ModalDeleteRedirections />);
    const cancelButton = screen.getByTestId('cancel-btn');
    fireEvent.click(cancelButton);
  });

  it('should trigger the correct action on delete', () => {
    render(<ModalDeleteRedirections />);
    const deleteButton = screen.getByTestId('delete-btn');
    fireEvent.click(deleteButton);
  });
});
