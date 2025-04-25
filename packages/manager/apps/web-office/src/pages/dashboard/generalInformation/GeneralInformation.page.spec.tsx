import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import GeneralInformation from './GeneralInformation.page';
import { render, screen } from '@/utils/test.provider';
import {
  licensesMock,
  licensesPrepaidExpandedMock,
  parentTenantMock,
} from '@/data/api/__mocks__';
import { getOfficeUsers } from '@/data/api/users';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

describe('GeneralInformation page', () => {
  it('Page for payAsYouGo', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });

    const { findByText } = render(<GeneralInformation />);

    expect(
      await findByText(commonTranslation.general_informations),
    ).toBeVisible();

    expect(
      screen.getByText(commonTranslation.displayName).closest('dt').nextSibling
        .firstChild.firstChild.textContent,
    ).toBe(licensesMock[0].displayName);
    expect(
      screen.getByText(commonTranslation.serviceName).closest('dt').nextSibling
        .textContent,
    ).toBe(licensesMock[0].serviceName);
    expect(
      screen.getByText(commonTranslation.serviceType).closest('dt').nextSibling
        .textContent,
    ).toBe(commonTranslation.payAsYouGo);

    expect(
      screen.getByText(commonTranslation.license_number).closest('dt')
        .nextSibling.textContent,
    ).toBe('officeBusiness : 1officeProPlus : 2');

    expect(
      screen.getByText(commonTranslation.creation_date).closest('dt')
        .nextSibling.textContent,
    ).toBe('15 January 2023');

    expect(
      screen.getByText(commonTranslation.status).closest('dt').nextSibling
        .firstChild,
    ).toHaveAttribute('label', commonTranslation.state_ok);
  });

  it('Page for prepaid', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesPrepaidExpandedMock[0].serviceName,
    });

    const { findByText } = render(<GeneralInformation />);

    expect(
      await findByText(commonTranslation.general_informations),
    ).toBeVisible();

    expect(
      screen.getByText(commonTranslation.displayName).closest('dt').nextSibling
        .firstChild.firstChild.textContent,
    ).toBe(parentTenantMock.displayName);
    expect(
      screen.getByText(commonTranslation.serviceName).closest('dt').nextSibling
        .textContent,
    ).toBe(parentTenantMock.serviceName);
    expect(
      screen.getByText(commonTranslation.serviceType).closest('dt').nextSibling
        .textContent,
    ).toBe(commonTranslation.prepaid);
    expect(
      screen.getByText(commonTranslation.license_number).closest('dt')
        .nextSibling.textContent,
    ).toBe('officeProPlus : 1');

    expect(
      screen.getByText(commonTranslation.creation_date).closest('dt')
        .nextSibling.textContent,
    ).toBe('15 January 2023');
    expect(
      screen.getByText(commonTranslation.status).closest('dt').nextSibling
        .firstChild,
    ).toHaveAttribute('label', commonTranslation.state_ok);
    expect(
      screen.getByText(commonTranslation.renew_date).closest('dt').nextSibling
        .textContent,
    ).toBe('15 January 2025');
  });

  it('Statistics if no users', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });

    vi.mocked(getOfficeUsers).mockReturnValue([]);

    const { findByText } = render(<GeneralInformation />);

    expect(await findByText(commonTranslation.statistics)).toBeVisible();

    expect(
      screen.getByText(commonTranslation.license_number).closest('dt')
        .nextSibling.textContent,
    ).toBe(commonTranslation.noAccountOffer);
  });
});
