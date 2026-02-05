import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import {
  assertOdsModalText,
  assertOdsModalVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import * as vrackHooks from '@ovh-ux/manager-network-common/src/vrack/hooks/useVrackIpList';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

import { labels, mockEditInputValue, mockSubmitNewValue, renderTest } from '../../../../test-utils';
import TEST_IDS from '../../../../utils/testIds.constants';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useNavigationGetUrl: vi.fn(([basePath, pathWithId]) => ({
      data: `${basePath}${pathWithId}`,
    })),
  };
});

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  vdc: SAFE_MOCK_DATA.vdcStandard,
};
const initialRoute = `/${config.org.id}/virtual-datacenters/${config.vdc.id}`;
const editDescriptionRoute = `${initialRoute}/edit-description`;

describe('Datacentre General Information Page Display', () => {
  it('display the datacentre dashboard general page', async () => {
    await renderTest({ initialRoute });

    await assertTextVisibility(labels.commun.dashboard.general_information);
  });
});

describe('Datacentre General Information Page Updates', () => {
  it.skip('update the description of the datacentre', async () => {
    const { container } = await renderTest({ initialRoute });

    await assertTextVisibility(labels.datacentres.managed_vcd_vdc_vcpu_count);

    const editButton = await getElementByTestId(TEST_IDS.editButton);

    await waitFor(() => userEvent.click(editButton));
    await assertOdsModalVisibility({ container, isVisible: true });

    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
    await mockSubmitNewValue({ submitCta });
    await assertOdsModalVisibility({ container, isVisible: false });

    expect(
      screen.queryByText(labels.dashboard.managed_vcd_dashboard_edit_description_modal_success),
    ).toBeVisible();
  });

  it('display helper message when the description input is invalid', async () => {
    const { container } = await renderTest({ initialRoute: editDescriptionRoute });
    const expectedError =
      labels.dashboard.managed_vcd_dashboard_edit_description_modal_helper_error;

    await assertOdsModalVisibility({ container, isVisible: true });
    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);

    await mockEditInputValue('');
    await assertOdsModalText({ container, text: expectedError });
    expect(submitCta).toBeDisabled();

    await mockEditInputValue('a'.repeat(256));
    await assertOdsModalText({ container, text: expectedError });
    expect(submitCta).toBeDisabled();
  });

  it.skip('display an error if update datacentre service is KO', async () => {
    const { container } = await renderTest({
      initialRoute: editDescriptionRoute,
      isDatacentreUpdateKo: true,
    });

    await assertOdsModalVisibility({ container, isVisible: true });

    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
    await mockSubmitNewValue({ submitCta });

    await assertOdsModalVisibility({ container, isVisible: true });
    await assertOdsModalText({ container, text: 'Datacentre update error' });
  });
});

describe('AddPublicIpBlock Modal', () => {
  beforeEach(() => {
    vi.spyOn(vrackHooks, 'useVrackIpList').mockReturnValue({
      ip: ['192.168.1.0/24', '10.0.0.0/24'],
      isLoading: false,
    } as unknown as ReturnType<typeof vrackHooks.useVrackIpList>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TODO [POST-MIG-ESLINT]: move this in AddPublicIpBlock.spec.tsx
  it('renders modal add up block correctly with a list of vrack', async () => {
    const { container } = await renderTest({
      initialRoute: `${initialRoute}/add-public-ip-block`,
    });

    await assertOdsModalVisibility({ container, isVisible: true });

    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_add_ip_public_block_modal_heading,
    );

    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_add_ip_public_block_information,
    );

    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_add_ip_public_block_description,
    );
    const submitCta = await getElementByTestId(TEST_IDS.modalSubmitCta);
    expect(submitCta).toBeDisabled();
  });
});
