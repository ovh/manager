import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import React from 'react';
import { RGDPIntroduction } from './RGDPIntroduction.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key),
  }),
  Trans: ({ i18nKey }: any) => <div>{i18nKey}</div>,
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsText: ({ children, color, level, size, className }: any) => (
    <div data-testid="osds-text" color={color} className={className}>
      {children}
    </div>
  ),
}));

describe('RGDPIntroduction Component', () => {
  it('renders the component correctly', () => {
    render(<RGDPIntroduction />);

    const titleElement = screen.getByText('rgdp_introduction_title');
    expect(titleElement).toBeInTheDocument();

    const purposeElement = screen.getByText(
      'rgdp_introduction_content_purpose',
    );
    expect(purposeElement).toBeInTheDocument();

    const identityVerificationElement = screen.getByText(
      'rgdp_introduction_content_identity_verification',
    );
    expect(identityVerificationElement).toBeInTheDocument();

    const noteElement = screen.getByText('rgdp_introduction_please_note');
    expect(noteElement).toBeInTheDocument();
  });
});
