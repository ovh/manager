import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LegalForm } from '@ovh-ux/manager-config';
import AccountTypeTooltipContent from './TooltipContent.component';

const renderComponent = (legalForms: LegalForm[]) =>
  render(<AccountTypeTooltipContent legalForms={legalForms} />);

describe('ReassuranceWording', () => {
  it('should display text and description for available legal forms', async () => {
    renderComponent(['corporation', 'individual']);

    const corporationTitleElement = screen.getByText('legal_form_corporation');
    const corporationDescriptionElement = screen.getByText(
      'legal_form_tooltip_corporation_description',
    );
    const individualTitleElement = screen.getByText('legal_form_individual');
    const individualDescriptionElement = screen.getByText(
      'legal_form_tooltip_individual_description',
    );
    const administrationTitleElement = screen.queryByText(
      'legal_form_administration',
    );
    const administrationDescriptionElement = screen.queryByText(
      'legal_form_tooltip_administration_description',
    );
    const associationTitleElement = screen.queryByText(
      'legal_form_association',
    );
    const associationDescriptionElement = screen.queryByText(
      'legal_form_tooltip_association_description',
    );
    expect(corporationTitleElement).toBeInTheDocument();
    expect(corporationDescriptionElement).toBeInTheDocument();
    expect(individualTitleElement).toBeInTheDocument();
    expect(individualDescriptionElement).toBeInTheDocument();
    expect(administrationTitleElement).not.toBeInTheDocument();
    expect(administrationDescriptionElement).not.toBeInTheDocument();
    expect(associationTitleElement).not.toBeInTheDocument();
    expect(associationDescriptionElement).not.toBeInTheDocument();
  });
});
