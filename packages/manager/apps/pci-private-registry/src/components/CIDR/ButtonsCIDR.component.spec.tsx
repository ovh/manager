import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { UseSuspenseQueryResult } from '@tanstack/react-query';
import { useIpRestrictions } from '../../api/hooks/useIpRestrictions';
import Buttons from './ButtonsCIDR.component';
import { wrapper } from '@/wrapperRenders';
import { TIPRestrictionsData } from '@/types';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('@/pages/CIDR/useDatagridContext', () => ({
  __esModule: true,
  default: () => ({
    removeDraftRow: vi.fn(),
  }),
}));

vi.mock('../../api/hooks/useIpRestrictions', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useIpRestrictions: vi.fn(),
  };
});

vi.mock('@/pages/CIDR/useDatagridContext', () => ({
  __esModule: true,
  default: () => ({
    removeDraftRow: vi.fn(),
  }),
}));

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
    } as UseSuspenseQueryResult<TIPRestrictionsData[], Error>);
    const { result } = renderHook(
      () =>
        useForm({
          defaultValues: {
            authorization: [],
            description: '',
          },
        }),
      { wrapper },
    );

    render(
      <FormProvider {...result.current}>
        <Buttons />
      </FormProvider>,
      { wrapper },
    );
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

    vi.mocked(useNotifications).mockReturnValue({
      addSuccess: vi.fn((text, bool) => text + bool),
      addInfo: vi.fn(),
    });

    vi.mocked(useIpRestrictions).mockReturnValue({
      data: [
        { ipBlock: '192.168.0.1', authorization: ['management'] },
        { ipBlock: '192.168.0.2', authorization: ['registry'] },
      ],
    } as UseSuspenseQueryResult<TIPRestrictionsData[], Error>);

    const handleSubmitMock = vi.fn((fn: any) => fn);
    const { result } = renderHook(useForm, { wrapper });

    const methods = { ...result.current, handleSubmit: handleSubmitMock };

    render(
      <FormProvider {...methods}>
        <Buttons />
      </FormProvider>,
      { wrapper },
    );

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(handleSubmitMock).toHaveBeenCalledWith(expect.any(Function));
  });
});
