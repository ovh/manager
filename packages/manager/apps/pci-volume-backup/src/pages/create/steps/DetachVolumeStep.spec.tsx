import { fireEvent, render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { MOCKED_VOLUME } from '@/__tests__/mocks';
import DetachVolumeStep from './DetachVolumeStep';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('DetachVolumeStep', () => {
  const mockResetForm = vi.fn();
  const mockNavigate = vi.fn();

  const defaultProps = {
    volume: MOCKED_VOLUME,
    resetForm: mockResetForm,
  };

  it('should call reset when detach button is clicked', () => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(<DetachVolumeStep {...defaultProps} />);

    const detachButton = screen.getByTestId('DetachVolumeStep-button');

    fireEvent.click(detachButton);

    expect(mockResetForm).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      `./detach-volume?volumeId=${MOCKED_VOLUME.id}&instanceId=${MOCKED_VOLUME.attachedTo[0]}`,
    );
  });
});
