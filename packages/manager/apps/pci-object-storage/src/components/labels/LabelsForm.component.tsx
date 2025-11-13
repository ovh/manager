import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FieldLabel,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@datatr-ux/uxlib';
import { useLabelForm } from '@/components/labels/useLabelForm.hook';
import { FormField } from '../form-field/FormField.component';

export interface Label {
  key?: string;
  value?: string;
}

interface LabelsFormProps {
  configuredLabels: Label[];
  onAdd?: (newLabel: Label) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LabelsForm = React.forwardRef<HTMLInputElement, LabelsFormProps>(
  ({ configuredLabels, onAdd, open, onOpenChange }, ref) => {
    const { t } = useTranslation('components/labels');

    const { form } = useLabelForm({
      configuredLabel: configuredLabels?.map((label) => label.key),
    });

    const onSubmit = form.handleSubmit((formValues) => {
      onAdd(formValues);
      form.reset();
    });

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle>{t(`addTagTitle`)}</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <form onSubmit={onSubmit}>
            <div className="space-y-4" data-testid="tags-form-container">
              <FormField form={form} name="key">
                {(field) => (
                  <>
                    <FieldLabel data-testid="key-field-label">
                      {t('keyFieldLabel')}
                    </FieldLabel>
                    <Input data-testid="key-input-field" {...field} ref={ref} />
                  </>
                )}
              </FormField>
              <FormField form={form} name="value">
                {(field) => (
                  <>
                    <FieldLabel data-testid="value-field-label">
                      {t('valueFieldLabel')}
                    </FieldLabel>
                    <Input
                      data-testid="value-input-field"
                      {...field}
                      ref={ref}
                    />
                  </>
                )}
              </FormField>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="button" mode="ghost">
                    {t('cancelButton')}
                  </Button>
                </SheetClose>
                <Button type="submit" data-testid="tags-submit-button">
                  {t('confirmButton')}
                </Button>
              </SheetFooter>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    );
  },
);

LabelsForm.displayName = 'LabelsForm';

export default LabelsForm;
