import {
    Badge,
    BADGE_COLOR,
    Icon,    
    ICON_NAME,    
    Text,
    TEXT_PRESET,    
} from '@ovhcloud/ods-react';

import { 
    TenantsSubscriptionsDisclaimerProps,
} from '@/components/subscriptions/TenantsSubscriptionsDisclaimer.props';

const TenantsSubscriptionsDisclaimer = ({ text }: TenantsSubscriptionsDisclaimerProps) => {
    
    return (<Badge color={BADGE_COLOR.information} className='Badge p-4 flex justify-start items-start gap-4'>
        <Icon name={ICON_NAME.circleInfo} className='Icon mt-2 text-[var(--ods-color-primary-500)]' />
        <Text preset={TEXT_PRESET.paragraph} className='Text'>
            {text}            
        </Text>
    </Badge>
    );
};
export default TenantsSubscriptionsDisclaimer;
