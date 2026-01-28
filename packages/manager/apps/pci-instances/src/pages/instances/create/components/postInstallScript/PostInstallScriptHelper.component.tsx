import { FC } from 'react';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { Text } from '@ovhcloud/ods-react';

const PostInstallScriptHelper: FC = () => {
  return (
    <HelpDrawer>
      <Text preset="heading-2">{/* todo: translation */}</Text>
      <Text preset="paragraph" className="py-6">
        {/* todo: translation */}
      </Text>
    </HelpDrawer>
  );
};

export default PostInstallScriptHelper;
