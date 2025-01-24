import 'element-internals-polyfill';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import '../../../../../utils/test.provider';
import { render, waitFor } from '@testing-library/react';
import { Wrapper } from '../../utils';
import { BillingInformationsTile } from '../../BillingInformationsTile';
import { BillingInformationsCreationDate } from './CreationDate';

const renderWithMock = (mock: Partial<ServiceDetails>) => {
  return render(
    <Wrapper mock={mock}>
      <I18nextProvider i18n={i18n}>
        <BillingInformationsTile resourceName="my-resource-name">
          <BillingInformationsCreationDate />
        </BillingInformationsTile>
      </I18nextProvider>
    </Wrapper>,
  );
};

describe('BillingInformationsTile.CreationDate', () => {
  it('should display next billing date in full display', async () => {
    const { getByText } = renderWithMock(defaultServiceResponse);

    await waitFor(
      () => {
        expect(getByText('21 octobre 2024')).not.toBeNull();
      },
      { timeout: 500 },
    );
  });
});
