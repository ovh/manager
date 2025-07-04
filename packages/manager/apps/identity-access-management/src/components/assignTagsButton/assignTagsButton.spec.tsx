import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AssignTagButton, { AssignTagButtonProps } from './assignTagsButton';
import { getButtonByIcon } from '@/test-utils/uiTestHelpers';

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = (props: AssignTagButtonProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AssignTagButton {...props} />
    </QueryClientProvider>,
  );
};

describe('AssignTagButton Component', async () => {
  it('Should call onclick callback', async () => {
    const onclickMock = vi.fn();
    const { container } = renderComponent({
      onClick: onclickMock,
    });

    const button = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.plus,
    });

    await waitFor(() => fireEvent.click(button));

    expect(onclickMock).toHaveBeenCalled();
  });
});
