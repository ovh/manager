import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  FormField,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  Password,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { PasswordHint } from '@/components/passwordHint/PasswordHint';
import { useWebHostingDatabases } from '@/data/hooks/webHosting/webHostingDatabase/useWebHostingDatabase';
import { websiteFormSchema } from '@/utils/formSchemas.utils';
import { getModuleAdminNameRules, getModuleDbPasswordRules } from '@/utils/moduleInstall.utils';

import { DEFAULT_DATABASE_PORT, MODULE_INSTALL_LANGUAGES } from '../../constants';

type FormData = z.infer<typeof websiteFormSchema>;

interface AdvancedModuleInstallationProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  setValue: UseFormSetValue<FormData>;
}

export const AdvancedModuleInstallation: React.FC<AdvancedModuleInstallationProps> = ({
  control,
  controlValues,
  setValue,
}: AdvancedModuleInstallationProps) => {
  const { serviceName } = useParams();
  const { t } = useTranslation(['common', 'multisite']);

  const { data: databases } = useWebHostingDatabases(serviceName);

  const databaseItems = useMemo(
    () =>
      (databases ?? []).map((database) => ({
        label: `${database.name} (${database.server})`,
        value: database.name,
      })),
    [databases],
  );

  const languageItems = useMemo(
    () => MODULE_INSTALL_LANGUAGES.map(({ label, value }) => ({ label, value })),
    [],
  );

  const databasePasswordRules = useMemo(
    () =>
      getModuleDbPasswordRules(controlValues.databasePassword ?? '').map((rule) => ({
        label: t(`multisite:multisite_add_website_module_advanced_install_${rule.key}`),
        valid: rule.valid,
      })),
    [controlValues.databasePassword, t],
  );

  const adminPasswordRules = useMemo(
    () =>
      getModuleDbPasswordRules(controlValues.adminPassword ?? '', 12).map((rule) => ({
        label: t(`multisite:multisite_add_website_module_advanced_install_${rule.key}`),
        valid: rule.valid,
      })),
    [controlValues.adminPassword, t],
  );

  const adminNameRules = useMemo(
    () =>
      getModuleAdminNameRules(controlValues.adminName ?? '').map((rule) => ({
        label: t(`multisite:multisite_add_website_module_advanced_install_${rule.key}`),
        valid: rule.valid,
      })),
    [controlValues.adminName, t],
  );

  return (
    <div className="mt-2 flex flex-col space-y-4 rounded-lg border border-solid border-[var(--ods-color-neutral-200)] p-5">
      <Text>{t('multisite:multisite_add_website_module_advanced_install_description')}</Text>

      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_module_advanced_install_db_section_title')}
      </Text>
      <Text preset={TEXT_PRESET.caption}>
        {t('multisite:multisite_add_website_module_advanced_install_db_section_desc')}
      </Text>

      <Controller
        name="databaseSelected"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2" id="database-select">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_db_select_label')}
            </FormFieldLabel>
            <Select
              name={field.name}
              id="database-select"
              data-testid="database-select"
              value={field.value ? [field.value] : []}
              items={databaseItems}
              onValueChange={(detail: { value?: string[] }) => {
                const selected = Array.isArray(detail.value) ? (detail.value[0] ?? '') : '';
                field.onChange(selected);
                const database = databases?.find((item) => item.name === selected);
                if (database) {
                  setValue('databaseServer', database.server ?? '');
                  setValue('databaseName', database.name ?? '');
                  setValue('databasePort', String(database.port ?? DEFAULT_DATABASE_PORT));
                  setValue('databaseUser', database.user ?? '');
                }
              }}
            >
              <SelectControl
                aria-label={t(
                  'multisite:multisite_add_website_module_advanced_install_db_select_label',
                )}
              />
              <SelectContent />
            </Select>
          </FormField>
        )}
      />

      <Controller
        name="databaseServer"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_db_server_label')}
            </FormFieldLabel>
            <Input
              className="w-full"
              type={INPUT_TYPE.text}
              name={field.name}
              data-testid="database-server"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormField>
        )}
      />

      <Controller
        name="databaseName"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_db_name_label')}
            </FormFieldLabel>
            <Input
              className="w-full"
              type={INPUT_TYPE.text}
              name={field.name}
              data-testid="database-name"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormField>
        )}
      />

      <Controller
        name="databasePort"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_db_port_label')}
            </FormFieldLabel>
            <Input
              className="w-full"
              type={INPUT_TYPE.text}
              name={field.name}
              data-testid="database-port"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormField>
        )}
      />

      <Controller
        name="databaseUser"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_db_user_label')}
            </FormFieldLabel>
            <Input
              className="w-full"
              type={INPUT_TYPE.text}
              name={field.name}
              data-testid="database-user"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormField>
        )}
      />

      <Controller
        name="databasePassword"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_db_password_label')}
            </FormFieldLabel>
            <Password
              className="w-full"
              name={field.name}
              data-testid="database-password"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target?.value)}
            />
            <PasswordHint rules={databasePasswordRules} />
          </FormField>
        )}
      />

      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_module_advanced_install_admin_section_title')}
      </Text>
      <Text preset={TEXT_PRESET.caption}>
        {t('multisite:multisite_add_website_module_advanced_install_admin_section_desc')}
      </Text>

      <Controller
        name="adminName"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_admin_name_label')}
            </FormFieldLabel>
            <Input
              className="w-full"
              type={INPUT_TYPE.text}
              name={field.name}
              data-testid="admin-name"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
            <PasswordHint rules={adminNameRules} />
          </FormField>
        )}
      />

      <Controller
        name="adminPassword"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_admin_password_label')}
            </FormFieldLabel>
            <Password
              className="w-full"
              name={field.name}
              data-testid="admin-password"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target?.value)}
            />
            <PasswordHint rules={adminPasswordRules} />
          </FormField>
        )}
      />

      <Controller
        name="adminLanguage"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2" id="admin-language">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_language_label')}
            </FormFieldLabel>
            <Select
              name={field.name}
              id="admin-language"
              data-testid="admin-language"
              value={field.value ? [field.value] : []}
              items={languageItems}
              onValueChange={(detail: { value?: string[] }) =>
                field.onChange(Array.isArray(detail.value) ? (detail.value[0] ?? '') : '')
              }
            >
              <SelectControl
                aria-label={t(
                  'multisite:multisite_add_website_module_advanced_install_language_label',
                )}
              />
              <SelectContent />
            </Select>
          </FormField>
        )}
      />

      <Controller
        name="installPath"
        control={control}
        render={({ field }) => (
          <FormField className="w-1/2">
            <FormFieldLabel>
              {t('multisite:multisite_add_website_module_advanced_install_install_path_label')}
            </FormFieldLabel>
            <div className="flex items-center space-x-2">
              <Button size={BUTTON_SIZE.sm} variant={BUTTON_VARIANT.outline} disabled={true}>
                {`./${controlValues.path ? `${controlValues.path}/` : ''}`}
              </Button>
              <Input
                type={INPUT_TYPE.text}
                className="w-full"
                name={field.name}
                data-testid="install-path"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </div>
          </FormField>
        )}
      />
    </div>
  );
};
