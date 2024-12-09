import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsIcon, OsdsButton } from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  getRegistryQueyPrefixWithId,
  useIpRestrictions,
} from '@/api/hooks/useIpRestrictions';
import { TIPRestrictionsData } from '@/types';

type Entry = {
  ipBlock: string;
  authorization: string[];
};

function addUniqueEntry(entries: Entry[], newEntry: Entry): Entry {
  const existingEntry = entries.find(
    (entry) => entry.ipBlock === newEntry.ipBlock,
  );

  if (existingEntry) {
    newEntry.authorization.forEach((auth) => {
      if (!existingEntry.authorization.includes(auth)) {
        existingEntry.authorization.push(auth);
      }
    });
  }

  return newEntry;
}

const Buttons = () => {
  const queryClient = useQueryClient();
  const { projectId, registryId } = useParams();
  const { handleSubmit } = useFormContext();
  const { data: ipRestrictions } = useIpRestrictions(projectId, registryId, []);

  const removeDraftRow = () =>
    queryClient.setQueryData(
      getRegistryQueyPrefixWithId(projectId, registryId, [
        'management',
        'registry',
      ]),
      (oldData: TIPRestrictionsData[]) => oldData.filter((item) => !item.draft),
    );

  const onSubmit: SubmitHandler<TIPRestrictionsData> = (data) => {
    const log = addUniqueEntry(ipRestrictions, data);
    console.log(log);
  };

  return (
    <div className="grid grid-cols-[0.45fr,0.45fr] gap-4">
      <OsdsButton
        data-testid="remove-draft-button"
        onClick={removeDraftRow}
        type={ODS_BUTTON_TYPE.submit}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.CLOSE}
        />
      </OsdsButton>

      <OsdsButton
        data-testid="submit-button"
        role="submit"
        type={ODS_BUTTON_TYPE.submit}
        onClick={handleSubmit(onSubmit)}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.OK}
        />
      </OsdsButton>
    </div>
  );
};

export default Buttons;
