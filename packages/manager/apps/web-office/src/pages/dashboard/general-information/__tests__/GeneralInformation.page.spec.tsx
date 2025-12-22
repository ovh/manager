import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import dashboardCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import statusCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';

import { licensesMock, licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { parentTenantMock } from '@/data/api/__mocks__/parentTenant';
import { getOfficeUsers } from '@/data/api/users/api';
import { UserNativeType } from '@/data/api/users/type';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { renderWithRouter } from '@/utils/Test.provider';

import GeneralInformation from '../GeneralInformation.page';

describe('GeneralInformation page', () => {
  it('Page for payAsYouGo', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });

    const { findByText } = renderWithRouter(<GeneralInformation />);

    expect(await findByText(dashboardCommonTranslation.general_information)).toBeVisible();

    await waitFor(() => {
      expect(
        screen.getByText(commonTranslation.displayName).closest('dt').nextSibling.firstChild
          .firstChild.textContent,
      ).toBe(licensesMock[0].displayName);
    });

    expect(
      screen.getByText(commonTranslation.serviceName).closest('dt').nextSibling.textContent,
    ).toBe(licensesMock[0].serviceName);

    expect(
      screen.getByText(dashboardCommonTranslation.service_type).closest('dt').nextSibling
        .textContent,
    ).toBe(commonTranslation.payAsYouGo);

    expect(
      screen.getByText(dashboardCommonTranslation.license_number).closest('dt').nextSibling
        .textContent,
    ).toBe('officeBusiness : 1officeProPlus : 2');

    expect(
      screen.getByText(dashboardCommonTranslation.creation_date).closest('dt').nextSibling
        .textContent,
    ).toBe('15 January 2023');

    expect(
      screen.getByText(statusCommonTranslation.status).closest('dt').nextSibling.firstChild,
    ).toHaveTextContent(statusCommonTranslation.ok);
  });

  it('Page for prepaid', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesPrepaidExpandedMock[0].serviceName,
    });

    const { findByText } = renderWithRouter(<GeneralInformation />);

    expect(await findByText(dashboardCommonTranslation.general_information)).toBeVisible();

    await waitFor(() => {
      const dt = screen.getByText(commonTranslation.displayName).closest('dt');
      const dd = dt?.nextSibling;
      const ddText = dd?.textContent?.replace('common_iam_actions_message', '').trim();
      expect(ddText).toBe(parentTenantMock.displayName);
    });

    expect(
      screen.getByText(commonTranslation.serviceName).closest('dt').nextSibling.textContent,
    ).toBe(parentTenantMock.serviceName);

    expect(
      screen.getByText(dashboardCommonTranslation.service_type).closest('dt').nextSibling
        .textContent,
    ).toBe(commonTranslation.prepaid);

    expect(
      screen.getByText(dashboardCommonTranslation.license_number).closest('dt').nextSibling
        .textContent,
    ).toBe('officeProPlus : 1');

    expect(
      screen.getByText(dashboardCommonTranslation.creation_date).closest('dt').nextSibling
        .textContent,
    ).toBe('15 January 2023');

    expect(
      screen.getByText(statusCommonTranslation.status).closest('dt').nextSibling.firstChild,
    ).toHaveTextContent(statusCommonTranslation.ok);

    expect(
      screen.getByText(dashboardCommonTranslation.renew_date).closest('dt').nextSibling.textContent,
    ).toBe('15 January 2025');
  });

  it('Statistics if no users', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });

    vi.mocked(getOfficeUsers).mockReturnValue(Promise.resolve([] as UserNativeType[]));

    const { findByText } = renderWithRouter(<GeneralInformation />);
    expect(await findByText(dashboardCommonTranslation.statistics)).toBeVisible();

    await waitFor(() => {
      expect(
        screen.getByText(dashboardCommonTranslation.license_number).closest('dt').nextSibling
          .textContent,
      ).toBe(commonTranslation.noAccountOffer);
    });
  });
});

describe('GeneralInformation W3C Validation', () => {
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<GeneralInformation />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
