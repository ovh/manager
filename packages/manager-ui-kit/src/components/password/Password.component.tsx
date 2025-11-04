import { Password as OdsPassword } from '@ovhcloud/ods-react';

import { PasswordProps } from '@/components/password/Password.props';

export const Password = (props: PasswordProps) => <OdsPassword {...props} />;
