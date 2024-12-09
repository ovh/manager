import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import rQuery from '@tanstack/react-query';
import { useIpRestrictions } from '../../api/hooks/useIpRestrictions';
import Buttons from './ButtonsCIDR';
import { wrapper } from '@/wrapperRenders';

vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('../../api/hooks/useIpRestrictions', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useIpRestrictions: vi.fn(),
  };
});

describe('Buttons component', () => {
  it('should render two buttons', () => {
    vi.mocked(useParams).mockReturnValue({
      projectId: 'project123',
      registryId: 'registry456',
    });
    vi.mocked(useIpRestrictions).mockReturnValue({
      data: [
        { ipBlock: '192.168.0.1', authorization: ['management'] },
        { ipBlock: '192.168.0.2', authorization: ['registry'] },
      ],
    });
    vi.mocked(useFormContext).mockReturnValue({
      handleSubmit: (fn: any) => fn,
    });
    render(<Buttons />, { wrapper });
    const submitButton = screen.getByTestId('submit-button');
    const cancelButton = screen.getByTestId('remove-draft-button');
    expect(submitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('should call handleSubmit with the correct data when the second button is clicked', () => {
    vi.mocked(useParams).mockReturnValue({
      projectId: 'project123',
      registryId: 'registry456',
    });
    vi.mocked(useIpRestrictions).mockReturnValue({
      data: [
        { ipBlock: '192.168.0.1', authorization: ['management'] },
        { ipBlock: '192.168.0.2', authorization: ['registry'] },
      ],
    });
    vi.mocked(useFormContext).mockReturnValue({
      handleSubmit: (fn: any) => fn,
    });
    const handleSubmitMock = vi.fn((fn: any) => fn);
    vi.mocked(useFormContext).mockReturnValue({
      handleSubmit: handleSubmitMock,
    });

    render(<Buttons />, { wrapper });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(handleSubmitMock).toHaveBeenCalled();
  });
});
