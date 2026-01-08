import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { RegionCertificationBadges } from './RegionCertificationBadges.component';

const renderComponent = async (certifications: string[]) => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return render(<RegionCertificationBadges certifications={certifications} />, { wrapper });
};

describe('RegionCertificationBadges component test suite', () => {
  it('should return null when certifications is an empty array', async () => {
    // GIVEN
    const certifications: string[] = [];

    // WHEN
    const { container } = await renderComponent(certifications);

    // THEN
    expect(container.firstChild).toBeNull();
  });

  it('should return null when certifications is undefined', async () => {
    // GIVEN
    const certifications = undefined as unknown as string[];

    // WHEN
    const { container } = await renderComponent(certifications);

    // THEN
    expect(container.firstChild).toBeNull();
  });

  it('should render a single badge for one certification', async () => {
    // GIVEN
    const certifications = ['ISO_27001'];

    // WHEN
    await renderComponent(certifications);

    // THEN
    expect(screen.getByText('ISO-27001')).toBeInTheDocument();
  });

  it('should render multiple badges for multiple certifications', async () => {
    // GIVEN
    const certifications = ['ISO_27001', 'SOC_2', 'HIPAA'];

    // WHEN
    await renderComponent(certifications);

    // THEN
    expect(screen.getByText('ISO-27001')).toBeInTheDocument();
    expect(screen.getByText('SOC-2')).toBeInTheDocument();
    expect(screen.getByText('HIPAA')).toBeInTheDocument();
  });

  it('should format label by replacing underscore with dash', async () => {
    // GIVEN
    const certifications = ['CERT_WITH_UNDERSCORE'];

    // WHEN
    await renderComponent(certifications);

    // THEN
    expect(screen.getByText('CERT-WITH_UNDERSCORE')).toBeInTheDocument();
  });
});
