import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { CheckBoxFormField } from '@/components/oidc/CheckBoxFormField.component';
import { InputFormField } from '@/components/oidc/InputFormField.component';
import { TextAreaFormField } from '@/components/oidc/TextAreaFormField.component';
import { camelToSnake, filterSchemaKeys } from '@/helpers';
import { PlaceHolder, oidcSchema } from '@/types';

const useFormFields = () => {
  const { t } = useTranslation('oidc-provider');

  return useMemo(() => {
    const excludeKeys = ['issuerUrl', 'clientId'];
    const schemaKeys = filterSchemaKeys(oidcSchema, excludeKeys);

    const componentMap = {
      signingAlgorithms: CheckBoxFormField,
      caContent: TextAreaFormField,
      default: InputFormField,
    };

    return schemaKeys.map((name) => {
      const snakeCaseName = camelToSnake(name);

      return {
        name,
        label: t(
          `pci_projects_project_kubernetes_details_service_oidc_provider_field_${snakeCaseName}_title`,
        ),
        description: t(
          `pci_projects_project_kubernetes_details_service_oidc_provider_field_${snakeCaseName}_description`,
        ),
        caption: ['requiredClaim', 'groupsClaim'].includes(name)
          ? t(
              `pci_projects_project_kubernetes_details_service_oidc_provider_field_${snakeCaseName}_caption`,
            )
          : undefined,
        placeholder: PlaceHolder[name],
        component: componentMap[name] || componentMap.default,
      };
    });
  }, [oidcSchema.shape, t]);
};

export default useFormFields;
