import { ComponentProps } from 'react';

import { OdsCode } from '@ovhcloud/ods-components/react';

export type DownloadCodeProps = ComponentProps<typeof OdsCode> & { downloadLink: string };

export const DownloadCode = ({ downloadLink, canCopy = true, ...rest }: DownloadCodeProps) => {
  return (
    <section className="flex flex-col gap-6">
      <OdsCode canCopy={canCopy} {...rest}>
        curl -O {downloadLink}
      </OdsCode>
      <OdsCode canCopy={canCopy} {...rest}>
        wget {downloadLink}
      </OdsCode>
    </section>
  );
};
