import React from 'react';
import ActionsCell from './ActionsCell';
import { render, waitFor } from '@/utils/test.provider';
import { rancherError, rancherMocked } from '@/_mock_/rancher';
import { RancherService } from '@/api/api.type';

const setupSpecTest = async (rancherService: RancherService = rancherMocked) =>
  waitFor(() =>
    render(
      <ActionsCell
        setSelectedRancher={() => true}
        openModal={() => true}
        rowData={rancherService}
      />,
    ),
  );

describe('Actions Cell', () => {
  it('Cell should render correctly manage and delete label', async () => {
    const screen = await setupSpecTest();

    const manageText = screen.getByText('manage');
    const deleteText = screen.getByText('delete');

    expect(manageText).not.toBeNull();
    expect(deleteText).not.toBeNull();
  });

  it('Manage should not be visible if rancher is in error', async () => {
    const screen = await setupSpecTest(rancherError);

    const manageText = screen.queryByText('manage');

    expect(manageText).toBeNull();
  });
});
