import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { oidcSchema } from '@/types';
import { formComponentFactory } from '@/helpers/formComponentFactory';
import { camelToSnake, filterSchemaKeys } from '@/helpers';

const useFormFields = () => {
  const { t } = useTranslation('oidc-provider');

  const fields = useMemo(() => {
    const excludeKeys = [
      'issuerUrl',
      'clientId',
      'groupsClaim',
      'requiredClaim',
    ];
    const schemaKeys = filterSchemaKeys(oidcSchema, excludeKeys);

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
        component: (props) => formComponentFactory(name, props),
      };
    });
  }, [oidcSchema.shape, t]);

  return fields;
};

export default useFormFields;
