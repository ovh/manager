export type TZoneHistory = {
    creationDate: string;
    zoneFileUrl: string;
};

export type TZoneHistoryWithDate = TZoneHistory & {
    date: string;
    id: string;
};
