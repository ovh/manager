import React from 'react';
import { Row } from '@tanstack/react-table';
import { describe, it } from 'vitest';
import { waitFor } from '@testing-library/react';
import listingTranslation from '../../../../public/translations/listing/Messages_fr_FR.json';
import ActionsCell from './ActionsCell.component';
import { render } from '../../../utils/test/test.provider';
import { rancherError, rancherMocked } from '../../../_mock_/rancher';
import { RancherService } from '../../../types/api.type';

const setupSpecTest = async (rancherService: RancherService = rancherMocked) =>
  waitFor(() =>
    render(
      <ActionsCell
        onClickDelete={() => true}
        onClickManage={() => true}
        row={{ original: rancherService } as Row<RancherService>}
      />,
    ),
  );

describe('Actions Cell', () => {
  it('Cell should render correctly manage and delete label', async () => {
    const screen = await setupSpecTest();

    const manageText = screen.getByText(listingTranslation.manage);
    const deleteText = screen.getByText(listingTranslation.delete);

    expect(manageText).not.toBeNull();
    expect(deleteText).not.toBeNull();
  });

  it('Manage should not be visible if rancher is in error', async () => {
    const screen = await setupSpecTest(rancherError);

    const manageText = screen.queryByText(listingTranslation.manage);

    expect(manageText).toBeNull();
  });
});
