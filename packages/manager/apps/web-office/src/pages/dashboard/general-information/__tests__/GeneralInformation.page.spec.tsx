import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { licensesMock, licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { parentTenantMock } from '@/data/api/__mocks__/parentTenant';
import { getOfficeUsers } from '@/data/api/users/api';
import { UserNativeType } from '@/data/api/users/type';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { renderWithRouter } from '@/utils/Test.provider';

import GeneralInformation from '../GeneralInformation.page';

describe('GeneralInformation page', () => {
  // You should update according to new DOM
  /*
  : <body>
@ovh-ux/manager-web-office-app:test:   <div>
@ovh-ux/manager-web-office-app:test:     <div
@ovh-ux/manager-web-office-app:test:       class="w-full block"
@ovh-ux/manager-web-office-app:test:     >
@ovh-ux/manager-web-office-app:test:       <div
@ovh-ux/manager-web-office-app:test:         class="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6"
@ovh-ux/manager-web-office-app:test:       >
@ovh-ux/manager-web-office-app:test:         <div
@ovh-ux/manager-web-office-app:test:           class="_card_17gu3_2 _card--neutral_17gu3_22 w-full flex-col p-[1rem]"
@ovh-ux/manager-web-office-app:test:           data-ods="card"
@ovh-ux/manager-web-office-app:test:           data-testid="general_informations"
@ovh-ux/manager-web-office-app:test:         >
@ovh-ux/manager-web-office-app:test:           <section
@ovh-ux/manager-web-office-app:test:             class="flex flex-col w-full"
@ovh-ux/manager-web-office-app:test:           >
@ovh-ux/manager-web-office-app:test:             <h4
@ovh-ux/manager-web-office-app:test:               class="_text_b5nz7_6 _text--heading-4_b5nz7_38"
@ovh-ux/manager-web-office-app:test:               data-ods="text"
@ovh-ux/manager-web-office-app:test:             >
@ovh-ux/manager-web-office-app:test:               general_information
@ovh-ux/manager-web-office-app:test:             </h4>
@ovh-ux/manager-web-office-app:test:             <hr
@ovh-ux/manager-web-office-app:test:               class="_divider_l59rc_2 _divider--24_l59rc_38 w-full"
@ovh-ux/manager-web-office-app:test:               data-ods="divider"
@ovh-ux/manager-web-office-app:test:             />
@ovh-ux/manager-web-office-app:test:             <dl
@ovh-ux/manager-web-office-app:test:               class="flex flex-col m-0"
@ovh-ux/manager-web-office-app:test:             >
@ovh-ux/manager-web-office-app:test:               <div
@ovh-ux/manager-web-office-app:test:                 class="flex flex-col gap-1"
@ovh-ux/manager-web-office-app:test:               >
@ovh-ux/manager-web-office-app:test:                 <dt
@ovh-ux/manager-web-office-app:test:                   class="flex justify-between"
@ovh-ux/manager-web-office-app:test:                 >
@ovh-ux/manager-web-office-app:test:                   <div
@ovh-ux/manager-web-office-app:test:                     class="flex items-center gap-1 text-[var(--ods-color-text)]"
@ovh-ux/manager-web-office-app:test:                   >
@ovh-ux/manager-web-office-app:test:                     <span
@ovh-ux/manager-web-office-app:test:                       class="_text_b5nz7_6 _text--span_b5nz7_72 font-bold"
@ovh-ux/manager-web-office-app:test:                       data-ods="text"
@ovh-ux/manager-web-office-app:test:                     >
@ovh-ux/manager-web-office-app:test:                       license_number
@ovh-ux/manager-web-office-app:test:                     </span>
@ovh-ux/manager-web-office-app:test:                   </div>
@ovh-ux/manager-web-office-app:test:                 </dt>
@ovh-ux/manager-web-office-app:test:                 <dd
@ovh-ux/manager-web-office-app:test:                   class="m-0"
@ovh-ux/manager-web-office-app:test:                 >
@ovh-ux/manager-web-office-app:test:                   <div
@ovh-ux/manager-web-office-app:test:                     class="flex items-center justify-between gap-2"
@ovh-ux/manager-web-office-app:test:                   >
@ovh-ux/manager-web-office-app:test:                     <p
@ovh-ux/manager-web-office-app:test:                       class="_text_b5nz7_6 _text--paragraph_b5nz7_61 break-all"
@ovh-ux/manager-web-office-app:test:                       data-ods="text"
@ovh-ux/manager-web-office-app:test:                     >
@ovh-ux/manager-web-office-app:test:                       user123.o365.ovh.com
@ovh-ux/manager-web-office-app:test:                     </p>
@ovh-ux/manager-web-office-app:test:                     <div
@ovh-ux/manager-web-office-app:test:                       class="min-w-fit"
@ovh-ux/manager-web-office-app:test:                     >
@ovh-ux/manager-web-office-app:test:                       <button
@ovh-ux/manager-web-office-app:test:                         class="_button_6crpx_2 _button--primary_6crpx_276 _button--sm_6crpx_209 _button--ghost_6crpx_327 _tooltip-trigger_1musf_2"
@ovh-ux/manager-web-office-app:test:                         data-ods="tooltip-trigger"
@ovh-ux/manager-web-office-app:test:                         data-part="trigger"
   */
  it.skip('Page for payAsYouGo', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });

    const { findByText } = renderWithRouter(<GeneralInformation />);

    expect(await findByText('general_information')).toBeVisible();

    await waitFor(() => {
      expect(
        screen.getByText(commonTranslation.displayName).closest('dt').nextSibling.firstChild
          .firstChild.textContent,
      ).toBe(licensesMock[0].displayName);
    });

    expect(
      screen.getByText(commonTranslation.serviceName).closest('dt').nextSibling.textContent,
    ).toBe(licensesMock[0].serviceName);
    expect(screen.getByText('service_type').closest('dt').nextSibling.textContent).toBe(
      commonTranslation.payAsYouGo,
    );

    expect(screen.getByText('license_number').closest('dt').nextSibling.textContent).toBe(
      'officeBusiness : 1officeProPlus : 2',
    );

    expect(screen.getByText('creation_date').closest('dt').nextSibling.textContent).toBe(
      '15 January 2023',
    );

    expect(screen.getByText('status').closest('dt').nextSibling.firstChild).toHaveAttribute(
      'label',
      'ok',
    );
  });

  // You should update according to new DOM
  it.skip('Page for prepaid', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesPrepaidExpandedMock[0].serviceName,
    });

    const { findByText } = renderWithRouter(<GeneralInformation />);

    expect(await findByText('general_information')).toBeVisible();

    await waitFor(() => {
      const dt = screen.getByText(commonTranslation.displayName).closest('dt');
      const dd = dt?.nextSibling;
      const ddText = dd?.textContent?.replace('common_iam_actions_message', '').trim();
      expect(ddText).toBe(parentTenantMock.displayName);
    });

    expect(
      screen.getByText(commonTranslation.serviceName).closest('dt').nextSibling.textContent,
    ).toBe(parentTenantMock.serviceName);
    expect(screen.getByText('service_type').closest('dt').nextSibling.textContent).toBe(
      commonTranslation.prepaid,
    );
    expect(screen.getByText('license_number').closest('dt').nextSibling.textContent).toBe(
      'officeProPlus : 1',
    );

    expect(screen.getByText('creation_date').closest('dt').nextSibling.textContent).toBe(
      '15 January 2023',
    );
    expect(screen.getByText('status').closest('dt').nextSibling.firstChild).toHaveAttribute(
      'label',
      'ok',
    );
    expect(screen.getByText('renew_date').closest('dt').nextSibling.textContent).toBe(
      '15 January 2025',
    );
  });

  it.skip('Statistics if no users', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });

    vi.mocked(getOfficeUsers).mockReturnValue(Promise.resolve([] as UserNativeType[]));

    const { findByText } = renderWithRouter(<GeneralInformation />);
    expect(await findByText('statistics')).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText('license_number').closest('dt').nextSibling.textContent).toBe(
        commonTranslation.noAccountOffer,
      );
    });
  });
});

describe('GeneralInformation W3C Validation', () => {
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<GeneralInformation />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
