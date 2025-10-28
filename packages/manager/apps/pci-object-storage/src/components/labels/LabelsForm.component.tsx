import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="key"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="name-field-label">
                        {t('keyFieldLabel')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          data-testid="key-input-field"
                          {...field}
                          ref={ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem data-testid="value-field-label">
                      <FormLabel>{t('valueFieldLabel')}</FormLabel>
                      <FormControl>
                        <Input data-testid="value-input-field" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="button" mode="outline">
                      {t('cancelButton')}
                    </Button>
                  </SheetClose>
                  <Button type="submit">{t('confirmButton')}</Button>
                </SheetFooter>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    );
  },
);

LabelsForm.displayName = 'LabelsForm';

export default LabelsForm;
