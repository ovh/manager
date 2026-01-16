import { ComponentProps } from 'react';

import { OdsCode } from '@ovhcloud/ods-components/react';

import { OS } from '@/types/Os.type';
import { getLinkFilename } from '@/utils/getLinkFilename';

export type DownloadCodeProps = ComponentProps<typeof OdsCode> & {
  downloadLink: string;
  osCompatibility: OS;
};

export const DownloadCode = ({
  downloadLink,
  canCopy = true,
  osCompatibility,
  ...rest
}: DownloadCodeProps) => {
  const filename = getLinkFilename(downloadLink);
  return (
    <section className="flex flex-col gap-6">
      {osCompatibility === 'LINUX' && (
        <>
          <OdsCode canCopy={canCopy} {...rest}>
            curl -O &quot;{downloadLink}&quot;
          </OdsCode>
          <OdsCode canCopy={canCopy} {...rest}>
            wget &quot;{downloadLink}&quot;
          </OdsCode>
        </>
      )}
      {osCompatibility === 'WINDOWS' && (
        <OdsCode canCopy={canCopy} {...rest}>
          Invoke-WebRequest -Uri &quot;{downloadLink}&quot; -OutFile &quot;{filename}&quot;
        </OdsCode>
      )}
    </section>
  );
};
