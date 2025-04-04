import { useState, useEffect, useMemo } from 'react';
import {
  OsdsButton,
  OsdsModal,
  OsdsFormField,
  OsdsText,
  OsdsTextarea,
  OsdsInput,
  OsdsDatepicker,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsClipboard,
  OsdsMessage,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_CHIP_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import getLocaleForDatePicker from '@/components/utils/getLocaleForDatepicker';
import { useCreateToken } from '@/hooks/api/database/token/useToken.hook';
import { TokenData } from '@/types/cloud/project/database/token/index';

type InputEvent = CustomEvent<{ value?: string }>;
type DateEvent = CustomEvent<{ value?: Date }>;
type CheckboxEvent = CustomEvent<{ checked: boolean }>;

type TokenModalProps = {
  onClose: () => void;
  projectId: string;
  tokens: string[];
  mode?: 'create' | 'update' | 'delete';
  initialValues?: {
    tokenName: string;
    description: string;
    expirationDate?: Date;
  };
  onSubmit?: (payload?: {
    tokenName: string;
    description: string;
    expirationDate: Date;
  }) => void;
  infiniteDate: Date;
};

export default function TokenModal({
  onClose,
  projectId,
  tokens,
  mode = 'create',
  initialValues,
  onSubmit,
  infiniteDate,
}: TokenModalProps) {
  const { t } = useTranslation('token');
  const [tokenName, setTokenName] = useState(initialValues?.tokenName || '');
  const [description, setDescription] = useState(
    initialValues?.description || '',
  );
  const [expirationDate, setExpirationDate] = useState<Date>(
    initialValues?.expirationDate || infiniteDate,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasNameError, setHasNameError] = useState(false);
  const [hasNameMissing, setHasNameMissing] = useState(false);
  const [createdToken, setCreatedToken] = useState<TokenData | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const localDatePicker = getLocaleForDatePicker();
  const today = new Date();

  const { createToken } = useCreateToken({
    projectId,
    onError: () => {},
    onSuccess: (newToken) => {
      setCreatedToken(newToken);
    },
  });

  useEffect(() => {
    if (mode !== 'create' || createdToken || isCreating) return;
    if (tokenName.trim() === '') {
      setHasNameError(false);
      return;
    }
    const exists = tokens.some(
      (existingName) => existingName === tokenName.trim(),
    );
    setHasNameError(exists);
  }, [tokenName, tokens, mode, createdToken, isCreating]);

  const handleInputChange = (event: InputEvent) => {
    const value =
      event.detail?.value ?? (event.target as HTMLInputElement)?.value ?? '';
    setTokenName(value);
    if (value.trim() !== '') {
      setHasNameMissing(false);
    }
  };

  const handleDescriptionChange = (event: InputEvent) => {
    const value =
      event.detail?.value ?? (event.target as HTMLTextAreaElement)?.value ?? '';
    setDescription(value);
  };

  const handleDatePickerChange = (event: DateEvent) => {
    const selectedDate = event.detail.value;
    setExpirationDate(selectedDate || infiniteDate);
    setShowDatePicker(false);
  };

  const handleCheckboxChange = (event: CheckboxEvent) => {
    const { checked } = event.detail;
    setIsChecked(checked);
    if (checked) {
      setShowDatePicker(true);
    } else {
      setExpirationDate(infiniteDate);
      setShowDatePicker(false);
    }
  };

  const handleSubmit = () => {
    if (mode !== 'delete' && !tokenName.trim()) {
      setHasNameMissing(true);
      return;
    }
    if (mode !== 'delete' && hasNameError) {
      return;
    }

    if (mode === 'create') {
      setIsCreating(true);
      const payload = {
        projectId,
        name: tokenName,
        description,
        expiresAt: expirationDate.toISOString(),
      };
      createToken(payload);
      return;
    }
    if ((mode === 'update' || mode === 'delete') && onSubmit) {
      onSubmit(
        mode === 'delete'
          ? undefined
          : { tokenName, description, expirationDate },
      );
      onClose();
    }
  };

  const modalHeadline = useMemo(() => {
    if (createdToken) return t('ai_endpoints_token_success');
    switch (mode) {
      case 'delete':
        return t('ai_endpoints_token_deletion');
      case 'update':
        return t('ai_endpoints_token_update');
      default:
        return t('ai_endpoints_token_creation');
    }
  }, [createdToken, mode, t]);

  const actionLabel = useMemo(() => {
    if (mode === 'delete') return t('ai_endpoints_token_deletion_confirm');
    if (mode === 'update') return t('ai_endpoints_token_udpate_confirm');
    return t('ai_endpoints_token_create');
  }, [mode, t]);

  const checkboxLabel =
    mode === 'update'
      ? t('ai_endpoints_token_expiration_date_update')
      : t('ai_endpoints_token_expiration_date');

  const displayChipValue =
    expirationDate.getTime() === infiniteDate.getTime()
      ? t('ai_endpoints_token_expiration')
      : expirationDate.toLocaleDateString();

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={onClose}
      dismissible={true}
      headline={modalHeadline}
    >
      {createdToken ? (
        <>
          <OsdsMessage
            type={ODS_MESSAGE_TYPE.info}
            className="my-8 max-w-[902px]"
          >
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('ai_endpoints_token_success_message')}
            </OsdsText>
          </OsdsMessage>
          <OsdsClipboard
            aria-label="clipboard"
            value={createdToken.token || ''}
          />
          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.flat}
            onClick={onClose}
            className="mt-4"
          >
            {t('ai_endpoints_token_understand')}
          </OsdsButton>
        </>
      ) : (
        <>
          {mode === 'delete' ? (
            <OsdsFormField>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                className="mt-4"
                size={ODS_TEXT_SIZE._400}
              >
                {t('ai_endpoints_token_deletion_message')}
                <span className="pl-1">
                  <strong>{tokenName}</strong>
                </span>
                ?
              </OsdsText>
            </OsdsFormField>
          ) : (
            <>
              <OsdsFormField>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="mt-6"
                  slot="label"
                >
                  {t('ai_endpoints_token_name')}
                </OsdsText>
                <OsdsInput
                  ariaLabel="token-name-input"
                  color={
                    hasNameError || hasNameMissing
                      ? ODS_THEME_COLOR_INTENT.error
                      : ODS_THEME_COLOR_INTENT.primary
                  }
                  type={ODS_INPUT_TYPE.text}
                  value={tokenName}
                  onOdsValueChange={handleInputChange}
                  className="max-w-[200px] mt-2"
                  disabled={mode !== 'create'}
                />
                {hasNameError && (
                  <OsdsText color={ODS_THEME_COLOR_INTENT.error} slot="helper">
                    {t('ai_endpoints_token_name_error')}
                  </OsdsText>
                )}
                {hasNameMissing && (
                  <OsdsText color={ODS_THEME_COLOR_INTENT.error} slot="helper">
                    {t('ai_endpoints_token_name_error')}
                  </OsdsText>
                )}
              </OsdsFormField>
              <OsdsFormField>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="flex mt-6"
                  slot="label"
                >
                  {t('ai_endpoints_token_description')}
                </OsdsText>
                <OsdsTextarea
                  ariaLabel={t('ai_endpoints_token_description')}
                  rows={5}
                  placeholder={t('ai_endpoints_token_description_placeholder')}
                  className="mt-2"
                  value={description}
                  onOdsValueChange={handleDescriptionChange}
                />
              </OsdsFormField>
              <OsdsFormField>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="mt-6"
                  slot="label"
                >
                  <span className="pr-4">
                    {t('ai_endpoints_token_expires')}
                  </span>
                  <OsdsChip
                    className="inline-flex max-w-fit justify-center"
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_CHIP_SIZE.sm}
                  >
                    {displayChipValue}
                  </OsdsChip>
                </OsdsText>
              </OsdsFormField>
              <OsdsFormField>
                <OsdsCheckbox
                  checked={isChecked}
                  onOdsCheckedChange={handleCheckboxChange}
                  className="mt-2 -ml-2 max-w-fit"
                >
                  <OsdsCheckboxButton
                    size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    <span slot="end">
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        level={ODS_TEXT_LEVEL.body}
                        size={ODS_TEXT_SIZE._400}
                      >
                        {checkboxLabel}
                      </OsdsText>
                    </span>
                  </OsdsCheckboxButton>
                </OsdsCheckbox>
              </OsdsFormField>
              {showDatePicker && (
                <OsdsFormField>
                  <OsdsDatepicker
                    onOdsDatepickerValueChange={handleDatePickerChange}
                    minDate={today}
                    locale={localDatePicker}
                    className="max-w-[294px] mt-4"
                  />
                </OsdsFormField>
              )}
            </>
          )}

          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.flat}
            onClick={handleSubmit}
          >
            {actionLabel}
          </OsdsButton>
        </>
      )}
    </OsdsModal>
  );
}
