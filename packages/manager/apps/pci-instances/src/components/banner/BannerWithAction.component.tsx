import { FC } from 'react';
import { Button } from '@ovhcloud/ods-react';
import { MessageProps } from '@ovh-ux/muk';
import Banner from './Banner.component';

type TBannerWithActionProps = {
  color: MessageProps['color'];
  titleKey: string;
  message: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
};

export const BannerWithAction: FC<TBannerWithActionProps> = ({
  color,
  titleKey,
  message,
  buttonLabel,
  onButtonClick,
}) => {
  return (
    <Banner color={color}>
      <div className="min-w-0 flex-1 break-words">
        <h4 className="text-md m-0 font-bold">{titleKey}</h4>
        <div className="break-words">{message}</div>
      </div>
      {buttonLabel && onButtonClick && (
        <Button className="mt-3 shrink-0" size="sm" onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      )}
    </Banner>
  );
};
