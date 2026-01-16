import { z } from "zod/v4";

export const urls = {
  zoneRoot: "/zone",
  //entry
  zoneAddEntry: "/zone/add-entry",
  zoneModifyEntry: "/zone/modify-entry",
  zoneDeleteEntry: "/zone/delete-entry",
  // modify 
  zoneModifyTextualRecord: "/zone/modify-textual-record",
  zoneModifyTtlRecord: "/zone/modify-ttl",
  // history 
  zoneHistory: "/zone/history",
  // reset 
  zoneReset: "/zone/reset",
  // delete 
  zoneDelete: "/zone/delete",

};
