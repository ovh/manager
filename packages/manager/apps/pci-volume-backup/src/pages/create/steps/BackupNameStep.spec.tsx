import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BackupNameStep from './BackupNameStep';

describe('BackupNameStep', () => {
  const mockOnBackupNameChange = vi.fn();

  const defaultProps = {
    backupName: 'test-backup',
    onBackupNameChange: mockOnBackupNameChange,
  };

  beforeEach(() => {
    mockOnBackupNameChange.mockClear();
  });

  it('should display the provided backup name in the input', () => {
    render(<BackupNameStep {...defaultProps} />);

    const nameInput = screen.getByTestId('BackupNameStep-input');

    expect(nameInput).toHaveDisplayValue('test-backup');
  });

  it('should call onBackupNameChange when input value changes', () => {
    render(<BackupNameStep {...defaultProps} />);

    const nameInput = screen.getByTestId('BackupNameStep-input');

    fireEvent.change(nameInput, {
      target: { value: 'new-backup-name' },
    });

    expect(mockOnBackupNameChange).toHaveBeenCalledTimes(1);
  });
});
