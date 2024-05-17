import React, { FunctionComponent } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetError,
} from 'react-hook-form';
import { FormDocumentFieldItem } from './FormDocumentFieldItem';
import documentsFieldRules from './documentFieldsConfiguration.json';
import { FileWithError } from '@/components/FileInput/FileInputContainer';

type Props = {
  legalForm: string;
  subsidiary: string;
  control: Control<FieldValues>;
};

type DocumentsFieldRules = {
  [key: string]: {
    [key: string]: {
      fields: {
        field: string;
        multiple: boolean;
        tooltipCount: number;
      }[];
    };
  };
};

export const FormDocumentFieldList: FunctionComponent<Props> = ({
  control,
  legalForm,
  subsidiary,
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

  return (
    <ul>
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
              multiple={field.multiple}
              value={value}
              onChange={(e) => onChange(e.files)}
              fieldCode={field.field}
              tooltipCount={field.tooltipCount}
            />
          )}
          name={field.field.replace('.', '')}
        />
      ))}
    </ul>
  );
};
