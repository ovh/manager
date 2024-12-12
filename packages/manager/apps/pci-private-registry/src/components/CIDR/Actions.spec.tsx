import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import ActionComponent from './Actions';

import { useUpdateIpRestriction } from '@/api/hooks/useIpRestrictions';
import { TIPRestrictionsData } from '@/types';
import { wrapper } from '@/wrapperRenders';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
vi.mock('@/api/hooks/useIpRestrictions', () => ({
  useUpdateIpRestriction: vi.fn(),
}));

describe('ActionComponent', () => {
  it('renders ActionMenu with correct items', () => {
    // Mock les valeurs retournées
    (useParams as Mock).mockReturnValue({
      projectId: 'project123',
      registryId: 'registry456',
    });
    const updateIpRestrictionsMock = vi.fn();
    (useUpdateIpRestriction as Mock).mockReturnValue({
      updateIpRestrictions: updateIpRestrictionsMock,
    });

    const cidrMock = ({
      ipBlock: '192.168.0.1/24',
      authorization: ['management'],
      description: 'Test description',
    } as unknown) as TIPRestrictionsData;

    const { result } = renderHook(useForm);

    render(
      <FormProvider {...result.current}>
        <ActionComponent cidr={cidrMock} />
      </FormProvider>,
      { wrapper },
    );

    const deleteButton = screen.getByText('ip_restrictions_delete_block');
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(updateIpRestrictionsMock).toHaveBeenCalledWith({
      cidrToUpdate: {
        management: [
          {
            ipBlock: '192.168.0.1/24',

            description: 'Test description',
          },
        ],
      },
      action: 'DELETE',
    });
  });
});
