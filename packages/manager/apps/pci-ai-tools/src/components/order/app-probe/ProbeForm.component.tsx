import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { HelpCircle, Plus } from 'lucide-react';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { useProbeForm } from './useProbeForm.hook';
import ai from '@/types/AI';

interface ProbeFormProps {
  probeValue: ai.app.ProbeInput;
  onChange: (newProbe: ai.app.ProbeInput) => void;
  disabled?: boolean;
}

const ProbeForm = React.forwardRef<HTMLInputElement, ProbeFormProps>(
  ({ probeValue, onChange, disabled }, ref) => {
    const [isActive, setIsActive] = useState(false);
    const { t } = useTranslation('ai-tools/components/app-probe');

    const { form } = useProbeForm();

    const onSubmit: SubmitHandler<ai.app.ProbeInput> = (
      data: ai.app.ProbeInput,
    ) => {
      onChange(data);
    };

    return (
      <Form {...form}>
        <div className="flex flex-row items-center gap-2">
          <Switch
            data-testid="probe-switch-button"
            checked={isActive}
            onCheckedChange={() => {
              setIsActive(!isActive);
              form.reset();
              onChange({});
            }}
          />
          <p>{isActive ? t('appProbeOnField') : t('appProbeOffField')}</p>
        </div>
        {isActive && (
          <div
            className="w-full grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]"
            data-testid="prob-form-input"
          >
            <FormField
              control={form.control}
              name="path"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center gap-2">
                    <FormLabel data-testid="name-field-label">
                      {t('pathFieldLabel')}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        {t('pathFieldInfo')}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input
                      data-testid="path-input-field"
                      {...field}
                      ref={ref}
                      placeholder="/health"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="port"
              defaultValue={probeValue.port}
              render={({ field }) => (
                <FormItem data-testid="value-field-label">
                  <div className="flex flex-row items-center gap-2">
                    <FormLabel>{t('portFieldLabel')}</FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        {t('portFieldInfo')}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="8080"
                      type="number"
                      data-testid="port-input-field"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              data-testid="probe-add-button"
              size="menu"
              variant="menu"
              mode="menu"
              className="shrink-0 mt-8 ml-2"
              onClick={form.handleSubmit(onSubmit)}
              disabled={disabled}
            >
              <Plus className="size-6" />
            </Button>
          </div>
        )}
      </Form>
    );
  },
);

ProbeForm.displayName = 'ProbeForm ';

export default ProbeForm;
