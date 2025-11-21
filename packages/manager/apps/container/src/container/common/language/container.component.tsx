import { ODS_SKELETON_SIZE } from "@ovhcloud/ods-components";
import { OsdsSkeleton } from "@ovhcloud/ods-components/react";

import LanguageMenu from "@/container/common/language";
import { Props } from "@/container/common/language/container.props";
import useContainer from "@/core/container";

export const LanguageMenuContainer = ({ onChange }: Props) => {
  const { isReady } = useContainer();

  if (!isReady) {
    return (
      <div className="px-6">
        <OsdsSkeleton inline={true} size={ODS_SKELETON_SIZE.xs} />
      </div>
    );
  }

  return <LanguageMenu onChange={onChange} />
};
