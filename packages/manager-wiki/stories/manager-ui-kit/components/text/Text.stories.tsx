import { Meta } from '@storybook/react';
import { Text, TextProps } from '@ovh-ux/muk';
import { IAM_ACTIONS, IAM_URNS } from '../../../../utils/iam.constants';

export const Default: Meta<TextProps> = {
  args: {
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS,
    children: 'lorem ipsum dolor sit amet',
  },
  parameters: {
    docs: {
      source: {
        code: `<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  lorem ipsum dolor sit amet
</Text>`,
      },
    },
  },
};

export const TextWithAuthorization: Meta<TextProps> = {
  args: {
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS,
  },
  parameters: {
    docs: {
      source: {
        code: `<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Confidential information
</Text>`,
      },
    },
  },
};

export const TextWithoutAuthorization: Meta<TextProps> = {
  args: {
    ...Default.args,
    urn: IAM_URNS.WITHOUT_AUTH,
  },
  parameters: {
    docs: {
      source: {
        code: `<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx-unauthorized"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  HIDDEN (user without authorization)
</Text>`,
      },
    },
  },
};

const meta = {
  title: 'Manager UI Kit/Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    ...Default.args,
    children:
      ' Confidential information will be displayed only for users with authorization. For users without authorization, HIDDEN text will be displayed with warning message in the tooltip.',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Text` component is used to display content with IAM authorization.',
      },
    },
  },
};

export default meta;
