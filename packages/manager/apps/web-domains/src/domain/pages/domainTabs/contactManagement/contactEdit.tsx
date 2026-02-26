import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  useOvhTracking,
  ButtonType,
  PageLocation,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { getOrderURL } from '@ovh-ux/manager-module-order';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Card, Link, Spinner,
  SPINNER_SIZE,
  Text,
  TEXT_PRESET,
  CARD_COLOR
} from '@ovhcloud/ods-react';
import { AxiosError } from 'axios';
import { useGetDomainContact } from '@/domain/hooks/data/query';
import {
  useGetConfigurationRule,
  useUpdateContactMutation,
} from '@/domain/hooks/domainTabs/useContactEdit';
import {
  SECTIONS,
  GENERAL_KEY,
  PROFILE_KEY,
  CONTACT_KEY,
  OTHER_KEY,
  FORCED_FIELDS,
  OPERATORS,
  CONTACT_MANAGEMENT_EDIT_TRACKING,
  CONFIGURATION_RULE_ACTIONS,
  getFieldLabelKey,
} from '@/domain/constants/contactEdit';
import { TConfigurationRuleField, ContactEditFormValues } from '@/domain/types/contactEdit';
import {
  getDescendantProp,
  findMatchingConstraint,
  resolveFormValue,
} from '@/domain/utils/contactEditConstraints';
import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import EditHolderFormField from '@/domain/components/ContactEdit/EditHolderFormField';

function getRulesBySection(
  rules: { fields: { and: TConfigurationRuleField[] } } | undefined,
  section: string,
): TConfigurationRuleField[] {
  if (!rules) return [];
  if (section !== OTHER_KEY) {
    const fields = SECTIONS[section];
    return rules.fields.and.filter((rule) => fields.includes(rule.label));
  }
  const fields = new Set([
    ...SECTIONS[GENERAL_KEY],
    ...SECTIONS[PROFILE_KEY],
    ...SECTIONS[CONTACT_KEY],
  ]);
  return rules.fields.and.filter((rule) => !fields.has(rule.label));
}

export default function ContactEdit() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const { serviceName, holderId } = useParams<{
    serviceName: string;
    holderId: string;
  }>();
  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();
  const { trackClick } = useOvhTracking();
  const shellContext = useContext(ShellContext);
  const { ovhSubsidiary } = shellContext.environment.getUser();
  const region = shellContext.environment.getRegion();
  const orderBaseUrl = getOrderURL('orderDomain', region, ovhSubsidiary);

  const backUrl = useGenerateUrl(urls.domainTabContactManagement, 'path', {
    serviceName,
  });

  const { domainContact, isFetchingDomainContact } = useGetDomainContact(
    holderId,
    { enabled: !!holderId },
  );
  const { rules, isRulesLoading } = useGetConfigurationRule(
    CONFIGURATION_RULE_ACTIONS.UPDATE,
    serviceName,
    { enabled: !!serviceName },
  );
  const { updateContact, isUpdateContactPending } = useUpdateContactMutation(
    holderId,
    serviceName,
  );

  // Form state
  const [formValues, setFormValues] = useState<ContactEditFormValues>({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form values from contact informations
  useEffect(() => {
    if (domainContact && rules) {
      const initialValues: ContactEditFormValues = {};
      rules.fields.and.forEach((rule) => {
        const value = getDescendantProp(
          domainContact as unknown as Record<string, unknown>,
          rule.label,
        );
        initialValues[rule.label] = value as string | null;
      });
      setFormValues(initialValues);
    }
  }, [domainContact, rules]);

  const handleFieldChange = useCallback(
    (fieldLabel: string, value: unknown) => {
      setFormValues((prev) => ({
        ...prev,
        [fieldLabel]: value as string | null,
      }));
      setIsDirty(true);
    },
    [],
  );

  const hasReadOnlyField = useMemo((): boolean => {
    if (!rules) return false;
    return rules.fields.and.some((rule) =>
      rule.constraints.some((c) => c.operator === OPERATORS.READONLY),
    );
  }, [rules]);

  const invalidFields = useMemo((): string[] => {
    if (!rules) return [];
    const contactInfo = domainContact as unknown as Record<string, unknown>;
    return rules.fields.and
      .filter((rule) => {
        const isReadOnly = rule.constraints.some(
          (c) => c.operator === OPERATORS.READONLY,
        );
        if (isReadOnly) return false;
        const isRequired =
          Object.values(FORCED_FIELDS).includes(rule.label) ||
          !!findMatchingConstraint(
            rule.constraints,
            OPERATORS.REQUIRED,
            formValues,
            contactInfo,
            rule.label,
          );
        return isRequired && !formValues[rule.label];
      })
      .map((rule) => t(getFieldLabelKey(rule.label)));
  }, [rules, formValues, domainContact]);

  const isFormValid = invalidFields.length === 0;

  const buildSubmitBody = useCallback((): Record<string, unknown> => {
    const contactData = { ...(domainContact as unknown as Record<string, unknown>) };
    delete contactData.id;

    // Deep clone nested objects to avoid mutating React Query cache
    Object.keys(contactData).forEach((key) => {
      if (contactData[key] && typeof contactData[key] === 'object') {
        contactData[key] = { ...(contactData[key] as Record<string, unknown>) };
      }
    });

    Object.entries(formValues).forEach(([key, value]) => {
      const resolvedValue = resolveFormValue(value);

      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        if (!contactData[parent] || typeof contactData[parent] !== 'object') {
          contactData[parent] = {};
        }
        (contactData[parent] as Record<string, unknown>)[child] =
          resolvedValue;
      } else {
        contactData[key] = resolvedValue;
      }
    });

    return contactData;
  }, [formValues, domainContact]);

  const handleSubmit = useCallback(() => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      ...CONTACT_MANAGEMENT_EDIT_TRACKING.SUBMIT,
    });

    const body = buildSubmitBody();
    updateContact(body, {
      onSuccess: () => {
        addSuccess(t('domain_tab_CONTACT_edit_form_success_msg'));
        navigate(backUrl);
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{
          message?: string;
          details?: Record<string, string>;
        }>;
        const details = axiosError?.response?.data?.details;
        const detailMessages = details
          ? Object.entries(details)
            .filter(([key]) => !key.startsWith('_'))
            .map(([, msg]) => msg)
          : [];

        const errorMsg =
          detailMessages.length > 0
            ? detailMessages.join(' — ')
            : axiosError?.response?.data?.message || error?.message;

        addError(
          t('domain_tab_CONTACT_edit_form_error_msg', { errorMsg }),
        );
      },
    });
  }, [backUrl, buildSubmitBody, updateContact, addSuccess, addError]);

  const handleCancel = useCallback(() => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      ...CONTACT_MANAGEMENT_EDIT_TRACKING.CANCEL,
    });
    navigate(backUrl);
  }, [backUrl]);

  if (isFetchingDomainContact || isRulesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size={SPINNER_SIZE.md} />
      </div>
    );
  }

  if (!domainContact || !rules) {
    return null;
  }

  const allSections = [
    [GENERAL_KEY, PROFILE_KEY],
    [CONTACT_KEY, OTHER_KEY],
  ];

  const renderSectionFieldset = (section: string) => {
    const sectionRules = getRulesBySection(rules, section);
    if (sectionRules.length === 0) return null;
    return (
      <Card key={section} data-testid={section} className="flex w-full flex-col p-6 mb-6" color={CARD_COLOR.neutral}>
        <Text preset={TEXT_PRESET.heading4} className="pb-4">
          {t(`domain_tab_CONTACT_edit_form_section_${section}`)}
        </Text>
        {sectionRules.map((rule) => (
          <EditHolderFormField
            key={rule.label}
            rule={rule}
            contactInformations={
              domainContact as unknown as Record<string, unknown>
            }
            formValues={formValues}
            onFieldChange={handleFieldChange}
          />
        ))}
      </Card>
    );
  };

  return (
    <div>
      <Text preset={TEXT_PRESET.heading3} className="pb-4">
        {t('domain_tab_CONTACT_edit_title')}
      </Text>
      <Text preset={TEXT_PRESET.paragraph} className="pb-6">
        {t('domain_tab_CONTACT_edit_holder_description')}
      </Text>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
          {allSections.map((columnSections) => (
            <div key={columnSections.join('-')}>
              {columnSections.map(renderSectionFieldset)}
            </div>
          ))}
        </div>

        {hasReadOnlyField && (
          <div className="mb-4">
            <Trans
              i18nKey={'domain_tab_CONTACT_edit_form_change_holder'}
              t={t}
              components={{
                Link: (
                  <Link
                    href={`${orderBaseUrl}?trade#/webCloud/trade/list?selection=~()`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackClick({
                        location: PageLocation.funnel,
                        buttonType: ButtonType.link,
                        ...CONTACT_MANAGEMENT_EDIT_TRACKING.LINK,
                      });
                    }}
                  />
                ),
              }}
            />

          </div>
        )}

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            size={BUTTON_SIZE.sm}
            disabled={
              !isFormValid || !isDirty || isUpdateContactPending
            }
            loading={isUpdateContactPending}
          >
            {t('domain_tab_CONTACT_edit_form_submit_btn')}
          </Button>
          <Button
            variant={BUTTON_VARIANT.outline}
            size={BUTTON_SIZE.sm}
            onClick={handleCancel}
            disabled={isUpdateContactPending}
          >
            {t('domain_tab_CONTACT_edit_form_cancel_btn')}
          </Button>
        </div>
      </form>
    </div>
  );
}