import React, { FC } from 'react';

type TVideoEmbedProps = {
  src: string;
  title: string;
  className?: string;
  allow?: string;
  allowFullScreen?: boolean;
};

const DEFAULT_ALLOW = 'clipboard-write; encrypted-media; picture-in-picture';

export const VideoEmbed: FC<TVideoEmbedProps> = ({
  src,
  title,
  className,
  allow = DEFAULT_ALLOW,
  allowFullScreen = true,
}) => (
  <div className={className}>
    <div className="relative w-full pb-[56.25%]">
      <iframe
        className="absolute left-0 top-0 h-full w-full rounded-lg"
        src={src}
        title={title}
        allow={allow}
        allowFullScreen={allowFullScreen}
      />
    </div>
  </div>
);
