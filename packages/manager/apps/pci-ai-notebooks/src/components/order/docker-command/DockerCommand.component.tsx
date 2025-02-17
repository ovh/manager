import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle, PlusCircle, TrashIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DOCKER_CONFIG } from '@/configuration/docker-command';

interface DockerCommandFormProps {
  commands: string[];
  onChange?: (newCommand: string[]) => void;
  disabled?: boolean;
}

const DockerCommand = React.forwardRef<
  HTMLInputElement,
  DockerCommandFormProps
>(({ commands, onChange, disabled }, ref) => {
  const { t } = useTranslation('components/docker-command');
  const commandRules = z
    .string()
    .trim()
    .min(DOCKER_CONFIG.command.min)
    .regex(DOCKER_CONFIG.command.pattern, {
      message: t('formDockerCommandErrorPattern'),
    });
  const commandSchema = z.object({
    command: commandRules,
  });

  const form = useForm({
    resolver: zodResolver(commandSchema),
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const dockerCommands: string[] = Array.from(
      new Set(
        formValues.command
          .split(' ')
          .filter((cmd: string) => cmd.trim() !== ''),
      ),
    );
    onChange(dockerCommands);
  });

  const removeCommand = () => {
    onChange([]);
    form.reset();
  };

  return (
    <Form {...form}>
      <div
        className="flex w-full items-start gap-2"
        data-testid="docker-command-form-container"
      >
        <div className="w-full">
          <FormField
            control={form.control}
            name="command"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row gap-2">
                  <FormLabel className="mt-2">
                    {t('commandInputLabel')}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="size-4 mt-1" />
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>{t('commandInputHelper')}</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl>
                  <Input
                    data-testid="command-input-field"
                    {...field}
                    ref={ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          data-testid="docker-command-button"
          variant={'ghost'}
          onClick={form.handleSubmit(onSubmit)}
          className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
          disabled={disabled}
        >
          <PlusCircle />
        </Button>
        {commands.length > 0 && (
          <Button
            data-testid="docker-command-remove-button"
            type="button"
            variant={'ghost'}
            onClick={() => removeCommand()}
            className="mt-[1.875rem] text-red-400 rounded-full p-2 ml-2 hover:text-red-400"
          >
            <TrashIcon />
          </Button>
        )}
      </div>
      <div>
        <ul data-testid="docker-command-list" className="list-disc">
          <div className="flex flex-row flex-wrap gap-4">
            {commands.map((command, index) => (
              <li key={index} className="ml-8 text-sm">
                {command}
              </li>
            ))}
          </div>
        </ul>
      </div>
    </Form>
  );
});

export default DockerCommand;
