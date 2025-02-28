import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { UseQueryResult } from '@tanstack/react-query';
import {
  VrackServicesWithIAM,
  useVrackServicesList,
  vrackServicesListMocks,
} from '@ovh-ux/manager-network-common';
import { OperationMessages } from './OperationMessages.component';

/** Render */

const renderComponent = ({ id }: { id?: string }) => {
  return render(<OperationMessages id={id} />);
};

/** END RENDER */

/** MOCKS */
vi.mock('@ovh-ux/manager-network-common', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-network-common') = await importOriginal();
  return {
    ...original,
    useVrackServicesList: vi.fn(),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string, params?: Record<string, string>) => {
      const flattenParams = params
        ? Object.keys(params).reduce((previous, current) => {
            return `${previous} | ${current}:${params[current]}`;
          }, '')
        : undefined;
      return flattenParams
        ? `${translationKey}${flattenParams}`
        : translationKey;
    },
    i18n: { language: 'fr_FR' },
  }),
}));
/** END MOCKS */

describe('OperationMessages Component', () => {
  it('should display a message for all vrs which are not ready', async () => {
    vi.mocked(useVrackServicesList).mockReturnValue({
      data: { data: vrackServicesListMocks },
    } as UseQueryResult<ApiResponse<VrackServicesWithIAM[]>, ApiError>);
    const { queryAllByText } = renderComponent({});
    expect(
      queryAllByText('vrackServicesInErrorMessage', { exact: false }).length,
    ).toBe(2);
    expect(
      queryAllByText('vrackServicesNotReadyInfoMessage', { exact: false })
        .length,
    ).toBe(4);
  });

  it('should display a message for a single vrs which is in error', async () => {
    vi.mocked(useVrackServicesList).mockReturnValue({
      data: { data: vrackServicesListMocks },
    } as UseQueryResult<ApiResponse<VrackServicesWithIAM[]>, ApiError>);
    const { queryAllByText } = renderComponent({ id: 'vrs-asp-dtl-lym-wza' });
    expect(
      queryAllByText('vrackServicesInErrorMessage', { exact: false }).length,
    ).toBe(1);
    expect(
      queryAllByText('vrackServicesNotReadyInfoMessage', { exact: false })
        .length,
    ).toBe(0);
  });

  it('should display a message for a single vrs which is updating', async () => {
    vi.mocked(useVrackServicesList).mockReturnValue({
      data: { data: vrackServicesListMocks },
    } as UseQueryResult<ApiResponse<VrackServicesWithIAM[]>, ApiError>);
    const { queryAllByText } = renderComponent({ id: 'vrs-ahz-9t0-7lb-b5l' });
    expect(
      queryAllByText('vrackServicesInErrorMessage', { exact: false }).length,
    ).toBe(0);
    expect(
      queryAllByText('vrackServicesNotReadyInfoMessage', { exact: false })
        .length,
    ).toBe(1);
  });

  it('should not display any messages if there is no vrs', async () => {
    vi.mocked(useVrackServicesList).mockReturnValue({
      data: { data: [] },
    } as UseQueryResult<ApiResponse<VrackServicesWithIAM[]>, ApiError>);
    const { queryAllByText } = renderComponent({});
    expect(
      queryAllByText('vrackServicesInErrorMessage', { exact: false }).length,
    ).toBe(0);
    expect(
      queryAllByText('vrackServicesNotReadyInfoMessage', { exact: false })
        .length,
    ).toBe(0);
  });
});
