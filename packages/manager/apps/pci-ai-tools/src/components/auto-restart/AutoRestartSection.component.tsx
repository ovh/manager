import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@datatr-ux/uxlib';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';

interface AutoRestartSectionProps {
  form: UseFormReturn<any>;
  app?: string;
}

export const AutoRestartSection = ({ form, app }: AutoRestartSectionProps) => {
  const { t } =
    app === 'job'
      ? useTranslation('ai-tools/jobs/create')
      : useTranslation('ai-tools/notebooks/create');

  return (
    <FormField
      control={form.control}
      name="timeoutAutoRestart"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center space-x-2">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel>{t('fieldAutoRestartLabel')}</FormLabel>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-4 cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="text-sm max-w-xs">
                <p>{t('fieldAutoRestartDescription')}</p>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
