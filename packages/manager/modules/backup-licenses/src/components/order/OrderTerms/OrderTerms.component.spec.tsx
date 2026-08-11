import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Contract } from '@ovh-ux/manager-module-order';

import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import OrderTerms, { ORDER_TERMS_ERROR_TEST_ID } from './OrderTerms.component';

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-components/react')>();
  const OdsCheckbox = ({
    onOdsChange,
    isChecked,
    isDisabled,
    inputId,
  }: {
    onOdsChange?: (event: CustomEvent) => void;
    isChecked?: boolean;
    isDisabled?: boolean;
    inputId?: string;
  }) => (
    <mock-checkbox
      id={inputId}
      is-checked={isChecked ? 'true' : undefined}
      is-disabled={isDisabled ? 'true' : undefined}
      ref={(node: HTMLElement | null) =>
        node?.addEventListener('odsChange', ((event: Event) =>
          onOdsChange?.(event as CustomEvent)) as EventListener)
      }
    />
  );
  return { ...actual, OdsCheckbox };
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'mock-checkbox': Record<string, unknown>;
    }
  }
}

const CONTRACTS: Contract[] = [
  { name: 'Contrat de service', url: 'https://contract.test/1', content: '' },
  { name: 'Conditions particulières', url: 'https://contract.test/2', content: '' },
];

const renderTerms = (props: Partial<React.ComponentProps<typeof OrderTerms>> = {}) =>
  renderWithProviders(
    <OrderTerms
      contractList={CONTRACTS}
      hasRegion
      isPreparing={false}
      hasFailed={false}
      isAccepted={false}
      onAcceptChange={vi.fn()}
      onRetry={vi.fn()}
      {...props}
    />,
  );

describe('OrderTerms', () => {
  it("invite à choisir une région tant qu'aucun panier ne peut exister", async () => {
    const { container } = await renderTerms({ hasRegion: false });

    expect(screen.getByText(labels.order.terms.placeholder)).toBeInTheDocument();
    expect(container.querySelector('mock-checkbox')).not.toBeInTheDocument();
  });

  it('annonce le chargement des contrats pendant la préparation du panier', async () => {
    const { container } = await renderTerms({ isPreparing: true, contractList: [] });

    expect(screen.getByText(labels.order.terms.loading)).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(container.querySelector('mock-checkbox')).not.toBeInTheDocument();
  });

  it('propose de réessayer quand la préparation a échoué', async () => {
    const onRetry = vi.fn();
    const { container } = await renderTerms({ hasFailed: true, contractList: [], onRetry });

    expect(screen.getByTestId(ORDER_TERMS_ERROR_TEST_ID)).toBeInTheDocument();
    expect(container.querySelector('mock-checkbox')).not.toBeInTheDocument();

    fireEvent.click(
      container.querySelector(`ods-button[label="${labels.order.terms.retry}"]`) as Element,
    );
    expect(onRetry).toHaveBeenCalled();
  });

  it('liste chaque contrat rendu par le panier, en lien externe', async () => {
    const { container } = await renderTerms();

    expect(container.querySelectorAll('ods-link')).toHaveLength(2);
    expect(container.querySelector('ods-link[label="Contrat de service"]')).toHaveAttribute(
      'href',
      'https://contract.test/1',
    );
  });

  it("remonte l'acceptation des conditions", async () => {
    const onAcceptChange = vi.fn();
    const { container } = await renderTerms({ onAcceptChange });

    fireEvent(
      container.querySelector('mock-checkbox') as Element,
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    expect(onAcceptChange).toHaveBeenCalledWith(true);
  });

  it('reflète une acceptation déjà donnée', async () => {
    const { container } = await renderTerms({ isAccepted: true });

    expect(container.querySelector('mock-checkbox')).toHaveAttribute('is-checked', 'true');
  });
});
