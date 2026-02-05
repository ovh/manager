import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Divider,
  Text,
  Textarea,
  ToggleCheckedChangeDetail,
} from '@ovhcloud/ods-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ToggleField } from '@/components/form';
import { TInstanceCreationForm } from '../CreateInstance.schema';

const PostInstallScript: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const postInstallScript = useWatch({ control, name: 'postInstallScript' });

  const isEnabled = postInstallScript !== null;

  const handleToggle = ({ checked }: ToggleCheckedChangeDetail) => {
    setValue('postInstallScript', checked ? '' : null);
  };

  const handleScriptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setValue('postInstallScript', event.target.value);
  };

  return (
    <div className="mt-4 flex flex-col">
      <Divider spacing="16" />
      <div className="flex items-center space-x-4">
        <Text preset="heading-4">
          {t('pci_instance_creation_post_install_script_title')}
        </Text>
      </div>
      <Text className="mt-4" preset="paragraph">
        {t('pci_instance_creation_post_install_script_description')}
      </Text>
      <ToggleField
        className="mt-6"
        withLabels
        label={t('pci_instance_creation_post_install_script_toggle_label')}
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
      {isEnabled && (
        <Textarea
          className="mt-4 w-1/2 font-mono"
          rows={4}
          value={postInstallScript}
          onChange={handleScriptChange}
        />
      )}
    </div>
  );
};

export default PostInstallScript;
