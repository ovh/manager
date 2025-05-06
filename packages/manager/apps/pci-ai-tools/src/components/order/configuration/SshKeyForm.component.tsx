import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import * as sshkey from '@datatr-ux/ovhcloud-types/cloud/sshkey/index';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { CONFIGURATION_CONFIG } from './configuration.constants';
import { OrderSshKey } from '@/types/orderFunnel';

interface SshKeyFormProps {
  configuredSshKeys: sshkey.SshKey[];
  sshKeyList: OrderSshKey[];
  onChange: (newSshKeyList: OrderSshKey[]) => void;
  disabled?: boolean;
}

const SshKeyForm = React.forwardRef<HTMLInputElement, SshKeyFormProps>(
  ({ configuredSshKeys, sshKeyList, onChange, disabled }, ref) => {
    const { t } = useTranslation('ai-tools/components/configuration');
    const [selectedSSH, setSelectedSSH] = useState<sshkey.SshKey>();
    const sshKeySchema = z.object({
      name: z
        .string()
        .min(1)
        .max(15)
        .refine(
          (newKeyName) =>
            !sshKeyList.some(
              (existingSSHKey) => existingSSHKey.name === newKeyName,
            ),
          {
            message: t('duplicateKeyError'),
          },
        ),
      sshKey: z.string().min(1),
    });

    const form = useForm({
      resolver: zodResolver(sshKeySchema),
    });

    const onSubmit: SubmitHandler<OrderSshKey> = (data: OrderSshKey) => {
      const newSSHKeys = [...sshKeyList, data];
      onChange(newSSHKeys);
    };

    const removeSSHKey = (indexToRemove: number) => {
      const newSSHKeys = sshKeyList.filter(
        (_, index) => index !== indexToRemove,
      );
      onChange(newSSHKeys);
    };

    return (
      <Form {...form}>
        {configuredSshKeys.length > 0 && (
          <div
            className="flex w-full items-start gap-2"
            data-testid="ssh-key-container"
          >
            <div className="w-full">
              <FormField
                control={form.control}
                name="name"
                render={() => (
                  <FormItem>
                    <FormLabel data-testid="ssh-key-select">
                      {t('configuredKeyFieldLabel')}
                    </FormLabel>
                    <Select
                      value={selectedSSH?.name}
                      onValueChange={(value) => {
                        const newSshKey: sshkey.SshKey = configuredSshKeys.find(
                          (sshKey) => sshKey.name === value,
                        );
                        setSelectedSSH(newSshKey);
                        form.setValue('name', newSshKey.name);
                        form.setValue('sshKey', newSshKey.publicKey);
                      }}
                    >
                      <SelectTrigger data-testid="select-sshKey-trigger">
                        <SelectValue
                          data-testid="select-value"
                          ref={ref}
                          placeholder={t('sshKeyFieldPlaceholder')}
                        />
                      </SelectTrigger>
                      <SelectContent data-testid="select-content">
                        {Object.values(configuredSshKeys).map((sshKey) => (
                          <SelectItem
                            data-testid="select-item"
                            key={sshKey.name}
                            value={sshKey.name}
                          >
                            {sshKey.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormControl />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              data-testid="ssh-key-add-button"
              size="menu"
              variant="menu"
              mode="menu"
              className="shrink-0 mt-8 ml-2"
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                disabled ||
                sshKeyList.length >= CONFIGURATION_CONFIG.maxSshKeyNumber
              }
            >
              <Plus className="size-6" />
            </Button>
          </div>
        )}
        <ul>
          {sshKeyList.map((sshKey, index) => (
            <li key={sshKey.name} className="flex items-center ml-5 text-sm">
              <span>{sshKey.name}</span>
              <Button
                data-testid={`ssh-key-remove-button-${index}`}
                className="text-red-500 rounded-full p-2 hover:text-red-500 h-8 w-8"
                mode="ghost"
                type="button"
                onClick={() => removeSSHKey(index)}
                disabled={disabled}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
        <p data-testid="ssh-key-configured">
          {t('numberOfConfiguredKeys', {
            count: sshKeyList.length,
            max: CONFIGURATION_CONFIG.maxSshKeyNumber,
            context: `${sshKeyList.length}`,
          })}
        </p>
      </Form>
    );
  },
);

SshKeyForm.displayName = 'SshKeysForm';

export default SshKeyForm;
