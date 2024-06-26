import React from 'react';
import { Row } from '@tanstack/react-table';
import ActionsCell from './ActionsCell';
import { render, waitFor } from '../../utils/test/test.provider';
import { pciSavingsPlanMocked } from '@/_mock_/savingsPlan'
import { SavingsPlanService } from '@/data/api/api.type';
// import listingTranslation from '@/../public/translations/listing/Messages_fr_FR.json'

const setupSpecTest = async (savingsPlanService: SavingsPlanService = pciSavingsPlanMocked) =>
  waitFor(() =>
    render(
      <ActionsCell
        onClickDelete={() => true}
        onClickManage={() => true}
        row={{ original: savingsPlanService } as Row<SavingsPlanService>}
      />,
    ),
  );
