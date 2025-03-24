import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { UseQueryResult } from '@tanstack/react-query';

import {
  VrackServicesWithIAM,
  useVrackServicesList,
  vrackServicesListMocks,
} from '@ovh-ux/manager-network-common';
import { SuccessMessages } from './SuccessMessage.component';
import { MessagesContext, MessagesContextType } from './Messages.context';

/** Render */
const mockContextMessage = {
  successMessages: [
    {
      id: 123,
      message: 'test-message',
      options: { linkLabel: 'test-link-label', linkUrl: 'test-link-url' },
    },
  ],
  hiddenMessages: [] as number[],
  hideMessage: vi.fn(),
  addSuccessMessage: vi.fn(),
};

const renderComponent = ({ id }: { id?: string }) => {
  return render(
    <MessagesContext.Provider value={mockContextMessage as MessagesContextType}>
      <SuccessMessages id={id} />
    </MessagesContext.Provider>,
  );
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
    const { getByText } = renderComponent({});
    await waitFor(async () => {
      const message = getByText('test-message');
      expect(message).toBeDefined();
      expect(getByText('test-link-label')).toBeDefined();
      const closeButton = message.closest('osds-message').children[1];
      const closeIcon = closeButton.closest('osds-icon');
      expect(closeIcon).toBeDefined();
    });
  });
});
