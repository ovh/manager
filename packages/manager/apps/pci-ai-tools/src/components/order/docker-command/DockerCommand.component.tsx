import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle, Plus, TrashIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Code,
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
  docker,
} from '@datatr-ux/uxlib';
import { DOCKER_CONFIG } from '@/configuration/docker-command';
import { parseDockerCommand } from '@/lib/dockerCommandHelper';

interface DockerCommandFormProps {
  commands: string[];
  onChange?: (newCommand: string[]) => void;
  disabled?: boolean;
}

const DockerCommand = React.forwardRef<
  HTMLInputElement,
  DockerCommandFormProps
>(({ commands, onChange, disabled }, ref) => {
  const { t } = useTranslation('ai-tools/components/docker-command');
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
    const dockerCommands: string[] = parseDockerCommand(formValues.command);
    onChange(dockerCommands);
  });

  const removeCommand = () => {
    onChange([]);
    form.reset();
  };

  return (
    <Form {...form}>
      <FormLabel className="scroll-m-20 text-xl font-bold">
        {t('fieldDockerCommandLabel')}
      </FormLabel>
      <p>{t('fieldDockedCommandDescription')}</p>
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
          size="menu"
          variant="menu"
          mode="menu"
          className="shrink-0 mt-8 ml-2"
          onClick={onSubmit}
          disabled={disabled}
        >
          <Plus className="size-6" />
        </Button>
        {commands.length > 0 && (
          <Button
            data-testid="docker-command-remove-button"
            type="button"
            mode="ghost"
            onClick={() => removeCommand()}
            className="mt-7 text-red-400 rounded-full p-2 ml-2 hover:text-red-400"
          >
            <TrashIcon />
          </Button>
        )}
      </div>
      {commands.length > 0 && (
        <Code
          className="text-sm"
          code={commands.join(' ')}
          showCopyButton={false}
          lang={docker}
        ></Code>
      )}
    </Form>
  );
});

export default DockerCommand;
