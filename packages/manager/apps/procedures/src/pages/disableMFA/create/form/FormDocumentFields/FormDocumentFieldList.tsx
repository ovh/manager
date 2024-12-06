import React, { FunctionComponent } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormDocumentFieldItem } from './FormDocumentFieldItem';
import documentsFieldRules from './documentFieldsConfiguration.json';
import { FileWithError } from '@/components/FileInput/FileInputContainer';
import { LegalFrom, Subsidiary } from '@/types/user.type';
import {
  acceptFile,
  maxFileSize,
  maxFiles,
} from './formDocumentFieldValidation.constants';

type Props = {
  legalForm: LegalFrom | 'default';
  subsidiary: Subsidiary | 'DEFAULT';
  control: Control<FieldValues>;
  disabled?: boolean;
};

type FieldDefinition = {
  field: string;
  translateCode: string;
  multiple: boolean;
  tooltips: string[];
};

type FieldsListDefinition = {
  fields: FieldDefinition[];
};
type DocumentsFieldRules = Record<
  LegalFrom | 'default',
  Record<Subsidiary | 'DEFAULT', FieldsListDefinition>
>;

export const FormDocumentFieldList: FunctionComponent<Props> = ({
  control,
  legalForm,
  subsidiary,
  disabled = false,
}) => {
  const rules = documentsFieldRules as DocumentsFieldRules;

  const legal = rules[legalForm] ?? rules.default;
  if (!legal)
    throw Error(
      `the legalform "default" does not exist in the document form configuration file`,
    );

  const sub = legal[subsidiary] ?? legal.DEFAULT;
  if (!sub)
    throw Error(
      `the subsidiary "DEFAULT" does not exist in the document form configuration file`,
    );

  const { fields } = sub;

  const { t: tdoc } = useTranslation('account-disable-2fa-documents');

  return (
    <ul data-testid="form-document-field-list">
      {fields.map((field) => (
        <Controller
          key={field.field}
          control={control}
          rules={{
            required: false,
            validate: {
              custom: (files: FileWithError[]) => {
                if (!files) return true;
                return files.flatMap((itemFile) => itemFile.errors).length < 1;
              },
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormDocumentFieldItem
              id={field.field}
              multiple={field.multiple}
              maxFiles={field.multiple ? maxFiles : 1}
              maxSize={maxFileSize}
              accept={acceptFile}
              value={value}
              onChange={(e) => onChange(e.files)}
              label={tdoc(field.translateCode)}
              tooltips={field.tooltips.map((tooltip) =>
                tdoc(tooltip, { maxFiles }),
              )}
              disabled={disabled}
            />
          )}
          name={field.field.replace('.', '')}
        />
      ))}
    </ul>
  );
};
