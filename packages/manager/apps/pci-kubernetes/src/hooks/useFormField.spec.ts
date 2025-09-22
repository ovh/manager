import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckBoxFormField } from '@/components/oidc/CheckBoxFormField.component';
import { InputFormField } from '@/components/oidc/InputFormField.component';
import { TextAreaFormField } from '@/components/oidc/TextAreaFormField.component';
import { camelToSnake, filterSchemaKeys } from '@/helpers';
import { PlaceHolder, oidcSchema } from '@/types';

import useFormFields from './useFormField';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('@/helpers', () => ({
  camelToSnake: vi.fn(),
  filterSchemaKeys: vi.fn(),
}));

describe('useFormFields', () => {
  const tMock = vi.fn();
  const schemaKeysMock = ['signingAlgorithms', 'caContent', 'usernameClaim'];

  beforeEach(() => {
    (useTranslation as Mock).mockReturnValue({ t: tMock });
    (filterSchemaKeys as Mock).mockReturnValue(schemaKeysMock);
    (camelToSnake as Mock).mockImplementation((key) =>
      key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns correctly mapped fields', () => {
    tMock.mockImplementation((key) => key);

    const { result } = renderHook(() => useFormFields());

    expect(result.current).toEqual([
      {
        name: 'signingAlgorithms',
        label:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_signing_algorithms_title',
        description:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_signing_algorithms_description',
        caption: undefined,
        placeholder: undefined,
        component: CheckBoxFormField,
      },
      {
        name: 'caContent',
        label:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_ca_content_title',
        description:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_ca_content_description',
        caption: undefined,
        placeholder: PlaceHolder.caContent,
        component: TextAreaFormField,
      },
      {
        name: 'usernameClaim',
        label:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_username_claim_title',
        description:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_username_claim_description',
        caption: undefined,
        placeholder: PlaceHolder.usernameClaim,
        component: InputFormField,
      },
    ]);

    expect(filterSchemaKeys).toHaveBeenCalledWith(oidcSchema, ['issuerUrl', 'clientId']);
    expect(camelToSnake).toHaveBeenCalledWith('signingAlgorithms');
    expect(camelToSnake).toHaveBeenCalledWith('caContent');
    expect(camelToSnake).toHaveBeenCalledWith('usernameClaim');
  });

  it('includes captions for specific fields', () => {
    const updatedSchemaKeysMock = ['requiredClaim', 'groupsClaim'];
    (filterSchemaKeys as Mock).mockReturnValue(updatedSchemaKeysMock);

    const { result } = renderHook(() => useFormFields());

    expect(result.current).toEqual([
      {
        name: 'requiredClaim',
        label:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_required_claim_title',
        description:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_required_claim_description',
        caption:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_required_claim_caption',
        placeholder: PlaceHolder.requiredClaim,
        component: InputFormField,
      },
      {
        name: 'groupsClaim',
        label:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_groups_claim_title',
        description:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_groups_claim_description',
        caption:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_groups_claim_caption',
        placeholder: PlaceHolder.groupsClaim,
        component: InputFormField,
      },
    ]);
  });
});
