import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { CONFIGURATION_CONFIG } from './configuration.constants';
import { OrderSshKey } from '@/types/orderFunnel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as sshkey from '@/types/cloud/sshkey';

interface SshKeyFormProps {
  configuredSshKeys: sshkey.SshKey[];
  sshKeyList: OrderSshKey[];
  onChange: (newSshKeyList: OrderSshKey[]) => void;
  disabled?: boolean;
}

const SshKeyForm = React.forwardRef<HTMLInputElement, SshKeyFormProps>(
  ({ configuredSshKeys, sshKeyList, onChange, disabled }) => {
    const { t } = useTranslation('pci-ai-notebooks/components/configuration');
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
      form.reset();
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
          <div className="flex w-full items-start gap-2">
            <div className="w-full">
              <FormItem>
                <FormLabel data-testid="ssh-key-select-label">
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(configuredSshKeys).map((sshKey) => (
                      <SelectItem key={sshKey.name} value={sshKey.name}>
                        {sshKey.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
            <Button
              data-testid="ssh-key-label-add-button"
              variant={'ghost'}
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                disabled ||
                sshKeyList.length >= CONFIGURATION_CONFIG.maxSshKeyNumber
              }
              className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
            >
              <PlusCircle />
            </Button>
          </div>
        )}
        <ul>
          {sshKeyList.map((sshKey, index) => (
            <li key={sshKey.name} className="flex items-center ml-5 text-sm">
              <span>{sshKey.name}</span>
              <Button
                data-testid={`ssh-key-label-remove-button-${index}`}
                className="text-red-500 rounded-full p-2 hover:text-red-500 h-8 w-8"
                variant={'ghost'}
                type="button"
                onClick={() => removeSSHKey(index)}
                disabled={disabled}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
        <p data-testid="ssh-key-configured-labels">
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
