import { TVolume } from '@ovh-ux/manager-pci-common';
import { fireEvent, render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import DetachVolumeStep from './DetachVolumeStep';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('DetachVolumeStep', () => {
  const mockResetForm = vi.fn();
  const mockNavigate = vi.fn();

  const defaultProps = {
    volume: { id: 'volume-id', attachedTo: ['instance-id'] } as TVolume,
    resetForm: mockResetForm,
  };

  it('should call reset when detach button is clicked', () => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(<DetachVolumeStep {...defaultProps} />);

    const detachButton = screen.getByTestId('DetachVolumeStep-button');

    fireEvent.click(detachButton);

    expect(mockResetForm).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      './detach-volume?volumeId=volume-id&instanceId=instance-id',
    );
  });
});
