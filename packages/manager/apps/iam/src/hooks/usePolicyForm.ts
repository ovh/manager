import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { RJSFSchema } from '@rjsf/utils';

import {
  listReferenceActions,
  listResource,
  listResourceGroup,
} from '@/api/iam';
import { IamApiReferenceAction, IamApiResourceGroup } from '@/api/types';

import usePolicy from './usePolicy';

export type IamPolicyFormData = {
  name: string;
  description: string;
  resources: string[];
  permissions: {
    allowAll: boolean;
    allow?: string[];
    exceptAll: boolean;
    except?: string[];
  };
};

export default function usePolicyForm(policyId?: string) {
  const { t } = useTranslation('iam/groups');
  let isPolicyLoading = false;

  const { data: resources, isLoading: isResourcesLoading } = useQuery(
    ['iam_resource'],
    async () => listResource(),
    {
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const { data: resourceGroups, isLoading: isResourceGroupLoading } = useQuery(
    ['iam_resource_group'],
    async () => listResourceGroup(),
    {
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const { data: actions, isLoading: isActionsLoading } = useQuery(
    ['iam_reference_action'],
    async () => listReferenceActions(),
    {
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const isLoading = [
    isResourcesLoading,
    isResourceGroupLoading,
    isActionsLoading,
  ].some((loading) => loading);

  // manage form schema
  let schema: RJSFSchema;

  if (!isLoading) {
    schema = {
      definitions: {
        actions: {
          type: 'string',
          anyOf: actions.map(({ action }: IamApiReferenceAction) => ({
            type: 'string',
            const: action,
            title: action,
          })),
        },
      },
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: t('policy_name'),
          pattern: '^[a-zA-Z0-9_+-\\/]*$',
        },
        description: {
          type: 'string',
          title: t('policy_description'),
        },
        resources: {
          type: 'array',
          title: t('policy_resources'),
          uniqueItems: true,
          items: {
            type: 'string',
            anyOf: [].concat(
              resources.map(({ urn, name }) => ({
                type: 'string',
                const: urn,
                title: name,
              })),
              resourceGroups.map(({ urn, name }: IamApiResourceGroup) => ({
                type: 'string',
                const: urn,
                title: name,
              })),
            ),
          },
        },
        permissions: {
          type: 'object',
          title: t('policy_permission'),
          properties: {
            allowAll: {
              type: 'boolean',
              title: t('policy_permission_allow_all'),
              default: true,
            },
            exceptAll: {
              type: 'boolean',
              title: t('policy_permission_except_all'),
              default: false,
            },
          },
          dependencies: {
            allowAll: {
              oneOf: [
                {
                  properties: {
                    allowAll: {
                      enum: [false],
                    },
                    allow: {
                      type: 'array',
                      title: t('policy_permission_allow'),
                      uniqueItems: true,
                      items: {
                        $ref: '#/definitions/actions',
                      },
                    },
                  },
                },
              ],
            },
            exceptAll: {
              oneOf: [
                {
                  properties: {
                    exceptAll: {
                      enum: [false],
                    },
                    except: {
                      type: 'array',
                      title: t('policy_permission_except'),
                      uniqueItems: true,
                      items: {
                        $ref: '#/definitions/actions',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      required: ['name'],
    };
  }

  // manage UI schema
  const uiSchema = {
    permissions: {
      allowAll: {
        'ui:widget': 'switch',
      },
      exceptAll: {
        'ui:widget': 'switch',
      },
      'ui:order': ['allowAll', 'allow', 'exceptAll', 'except'],
    },
  };

  // manage form data
  let formData;

  if (policyId) {
    const { policy, isPolicyLoading: isUsePolicyLoading } = usePolicy(policyId);
    isPolicyLoading = isUsePolicyLoading;

    if (!isPolicyLoading) {
      formData = {
        ...policy,
        resources: policy.resources.map(({ urn }) => urn),
        permissions: {
          allowAll:
            typeof policy.permissions.allow?.[0] === 'undefined'
              ? true
              : policy.permissions.allow?.[0]?.action === '*',
          allow: (policy.permissions.allow || []).map(({ action }) => action),
          exceptAll: policy.permissions.except?.[0]?.action === '*',
          except: (policy.permissions.except || []).map(({ action }) => action),
        },
      };
    }
  }

  const getPolicyPayload = (submittedData: IamPolicyFormData) => {
    return {
      ...submittedData,
      resources: (submittedData.resources || []).map((resourceUrn: string) => ({
        urn: resourceUrn,
      })),
      permissions: {
        allow: [] as { action: string }[],
        except: [] as { action: string }[],
      },
    };
  };

  return {
    isFormLoading: isLoading || isPolicyLoading,
    schema,
    uiSchema,
    formData,
    getPolicyPayload,
  };
}
