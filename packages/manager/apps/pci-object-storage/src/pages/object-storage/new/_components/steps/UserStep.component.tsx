import {
  Button,
  Dialog,
  DialogTrigger,
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
} from '@datatr-ux/uxlib';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import UserSecretKey from '@/pages/object-storage/users/user-secret/[userId]/_components/UserSecretKey.component';
import AddUserForm from '@/pages/object-storage/users/create/AddUserForm.component';

import * as TUser from '@/types/User';
import { useGetUserS3Credentials } from '@/data/hooks/user/useGetUserS3Credentials.hook';

interface UserStepProps {
  value?: number;
  onChange?: (newValue: number) => void;
  users: TUser.default.User[];
}
const UserStep = React.forwardRef<HTMLButtonElement, UserStepProps>(
  ({ value, onChange, users }, ref) => {
    const { t } = useTranslation('pci-object-storage/order-funnel');
    const currentUser = users.find((u) => u.id === value);

    const { projectId } = useParams();
    const query = useGetUserS3Credentials(projectId, currentUser?.id, {
      enabled: !!currentUser?.id,
    });
    return (
      <div data-testid="user-step-container">
        <Combobox value={`${value}`} onValueChange={(val) => onChange?.(+val)}>
          <ComboboxTrigger ref={ref}>
            <ComboboxValue
              placeholder={t('userInputPlaceholder')}
              value={currentUser?.description}
            />
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput placeholder={t('userSearchPlaceholder')} />
            <ComboboxList>
              <ComboboxEmpty>{t('userSearchPlaceholder')}</ComboboxEmpty>
              <ComboboxGroup>
                {users.map((u) => (
                  <ComboboxItem
                    key={u.id}
                    value={`${u.id}`}
                    keywords={[u.username, u.description]}
                  >
                    {u.description}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <div className="mt-4 flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="xs" mode="outline" className="rounded-md">
                {t('userCreateButton')}
              </Button>
            </DialogTrigger>
            <AddUserForm onClose={(user) => onChange(user.id)} />
          </Dialog>
          {query.data && query.data?.[0]?.access && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="xs" mode="outline" className="rounded-md">
                  {t('userShowCredentialsButton')}
                </Button>
              </DialogTrigger>
              <UserSecretKey
                user={{
                  ...currentUser,
                  access_key: query.data[0].access,
                }}
              />
            </Dialog>
          )}
        </div>
      </div>
    );
  },
);

UserStep.displayName = 'UserStep';
export default UserStep;
