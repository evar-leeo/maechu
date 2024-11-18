interface DoorayCommandMessage {
  tenantId: string;
  tenantDomain: string;
  channelId: string;
  channelName: string;
  userId: string;
  command: string;
  text: string;
  responseUrl: string;
  appToken: string;
  cmdToken: string;
  triggerId: string;
}

interface DoorayMessage {
  id: string;
  channelId: string;
  responseType: string;
  type: number;
  senderId: string;
  sendAt: string;
  seq: number;
  text: string;
  cmdToken: string;
  attachments: unknown[];
  unreadCount: number;
  mentionCount: number;
  flags: number;
  replaceOriginal: boolean;
  deleteOriginal: boolean;
}

interface DoorayActionMessage {
 mqType: number;
 tenant: {
  id: string;
  domain: string
 }
 appid: string;
 appIconAttachId: string;
 commandId: string;
 callbackId: string;
 commandName: string;
 commandRequestUrl: string;
 channel: {
  id: string;
  name: string;
 }
 user: {
  id: string;
  email: string;
 }
 command: string;
 text: string;
 responseUrl: string;
 appToken: string;
 cmdToken: string;
 triggerId: string;
 actionName: string;
 actionValue: string;
 channelLogId: string;
 originalMessage: DoorayMessage;
 dbid: number;
}