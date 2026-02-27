import { useEffect } from 'react';

import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Icon,
  Input,
  Password,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useGetHostingDatabase } from '@/data/hooks/webHostingDatabase/useWebHostingDatabase';
import { WebsiteFormData } from '@/utils/formSchemas.utils';

interface DatabaseConfigurationFieldsProps {
  control: Control<WebsiteFormData, unknown, WebsiteFormData>;
  controlValues: WebsiteFormData;
  setValue: UseFormSetValue<WebsiteFormData>;
  serviceName: string;
  databaseOptions: Array<{ value: string; label: string }>;
  errors: FieldErrors<WebsiteFormData>;
}

export const DatabaseConfigurationFields: React.FC<DatabaseConfigurationFieldsProps> = ({
  control,
  controlValues,
  setValue,
  serviceName,
  databaseOptions,
  errors,
}: DatabaseConfigurationFieldsProps) => {
  const { t } = useTranslation(['multisite', NAMESPACES.FORM, NAMESPACES.SYSTEM]);

  const { data: databaseDetails } = useGetHostingDatabase(
    serviceName,
    controlValues.selectedDatabase,
  );

  useEffect(() => {
    if (!databaseDetails) {
      return;
    }
    setValue('databaseServer', databaseDetails.name ?? '');
    setValue('databaseName', databaseDetails.name ?? '');
    setValue('databasePort', databaseDetails.port ? String(databaseDetails.port) : '3306');
    setValue('databaseUser', databaseDetails.user ?? '');
  }, [databaseDetails, setValue]);

  return (
    <>
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite_add_website_module_cms_advanced_database_title')}
      </Text>
      <Text>{t('multisite_add_website_module_cms_advanced_database_helper')}</Text>
      <Controller
        name="selectedDatabase"
        control={control}
        render={({ field, fieldState: { error, invalid } }) => (
          <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
            <FormFieldLabel>
              {`${t('multisite_add_website_module_cms_advanced_database_label')} - ${t(`${NAMESPACES.FORM}:required`)}`}
            </FormFieldLabel>
            <Select
              name={field.name}
              value={field.value ? [field.value] : []}
              items={databaseOptions}
              invalid={!!errors.selectedDatabase}
              onValueChange={(detail) => {
                const next = detail.value?.[0] ?? '';
                field.onChange(next);
                setValue('selectedDatabase', next);
                setValue('databaseServer', '');
                setValue('databaseName', '');
                setValue('databasePort', '');
                setValue('databaseUser', '');
              }}
              data-testid="database-select"
            >
              <SelectControl
                placeholder={t('multisite_add_website_module_cms_advanced_database_placeholder')}
              />
              <SelectContent />
            </Select>
            <FormFieldError>{errors?.selectedDatabase?.message}</FormFieldError>
          </FormField>
        )}
      />
      <div className="grid grid-cols-1 gap-4">
        <Controller
          name="databaseServer"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <FormFieldLabel>
                {`${t('multisite_add_website_module_cms_advanced_server_label')} - ${t(`${NAMESPACES.FORM}:required`)}`}
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                name={field.name}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                invalid={!!errors.databaseServer}
                disabled
                data-testid="database-server-input"
              />
              <FormFieldError>{errors?.databaseServer?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="databaseName"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <FormFieldLabel>
                {`${t('multisite_add_website_module_cms_advanced_database_name_label')} - ${t(`${NAMESPACES.FORM}:required`)}`}
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                name={field.name}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                invalid={!!errors.databaseName}
                disabled
                data-testid="database-name-input"
              />
              <FormFieldError>{errors?.databaseName?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="databasePort"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <FormFieldLabel>
                {`${t('multisite_add_website_module_cms_advanced_port_label')} - ${t(`${NAMESPACES.FORM}:required`)}`}
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                name={field.name}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                invalid={!!errors.databasePort}
                disabled
                data-testid="database-port-input"
              />
              <FormFieldError>{errors?.databasePort?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="databaseUser"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <FormFieldLabel>
                {`${t('multisite_add_website_module_cms_advanced_user_label')} - ${t(`${NAMESPACES.FORM}:required`)}`}
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                name={field.name}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                invalid={!!errors.databaseUser}
                disabled
                data-testid="database-user-input"
              />
              <FormFieldError>{errors?.databaseUser?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="databasePassword"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <div className="flex items-center gap-2">
                <FormFieldLabel>
                  {t(`${NAMESPACES.SYSTEM}:password`)} - {t(`${NAMESPACES.FORM}:required`)}
                </FormFieldLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleInfo} className="cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm space-y-1">
                    <Text preset={TEXT_PRESET.caption}>
                      {t(`${NAMESPACES.FORM}:change_password_helper1`)}
                    </Text>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>
                        <Text preset={TEXT_PRESET.caption}>
                          {t(`${NAMESPACES.FORM}:error_between_min_max_chars`, {
                            min: 8,
                            max: 31,
                          })}
                        </Text>
                      </li>
                      <li>
                        <Text preset={TEXT_PRESET.caption}>
                          {t(`${NAMESPACES.FORM}:change_password_helper2`)}
                        </Text>
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Password
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={!!errors.databasePassword}
                data-testid="database-password-input"
              />
              <FormFieldError>{errors?.databasePassword?.message}</FormFieldError>
            </FormField>
          )}
        />
      </div>
    </>
  );
};
