export type LiveChatType = 'Adrielly' | 'SNOW';
export type LiveChatState = 'open' | 'reduced';
export type ApiV6AuthToken = {
  token: string;
};

export type SnowChatContext = {
  skip_load_history?: string;
  live_agent_only?: string;
  requester_session_language?: string;
  language?: string;
  region?: string;
  queue: string;
  branding_key?: string;
  session_id: string;
  interface_type?: string;
  interface_name?: string;
};
