import { ComponentProps } from 'react';

import { OdsCode } from '@ovhcloud/ods-components/react';

export type DownloadCodeProps = ComponentProps<typeof OdsCode> & { downloadLink: string };

export const DownloadCode = ({ downloadLink, ...rest }: DownloadCodeProps) => {
  return (
    <section className="flex flex-col gap-6">
      <OdsCode canCopy {...rest}>
        curl -O {downloadLink}
      </OdsCode>
      <OdsCode canCopy {...rest}>
        wget {downloadLink}
      </OdsCode>
    </section>
  );
};
