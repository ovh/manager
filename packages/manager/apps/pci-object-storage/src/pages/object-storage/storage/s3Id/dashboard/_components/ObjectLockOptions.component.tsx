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
import { FormField } from '@/components/form-field/FormField.component';

export interface Label {
  key?: string;
  value?: string;
}

interface ObjectLockOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ObjectLockOptions = React.forwardRef<
  HTMLInputElement,
  ObjectLockOptionsProps
>(({ open, onOpenChange }, ref) => {
  const { t } = useTranslation('components/labels');

  const { form } = useLabelForm({
    configuredLabel: [],
  });

  const onSubmit = form.handleSubmit((formValues) => {
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
          <div className="space-y-4">
            <FormField form={form} name="key">
              {(field) => (
                <>
                  <FieldLabel data-testid="name-field-label">
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
                  <Input data-testid="value-input-field" {...field} ref={ref} />
                </>
              )}
            </FormField>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" mode="ghost">
                  {t('cancelButton')}
                </Button>
              </SheetClose>
              <Button type="submit">{t('confirmButton')}</Button>
            </SheetFooter>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
});

ObjectLockOptions.displayName = 'ObjectLockOptions';

export default ObjectLockOptions;
