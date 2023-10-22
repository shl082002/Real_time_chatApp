import React, { useReducer, useState } from "react";
import Conversation from "./Conversation";

export const ConversationContext =
  (React.createContext < Conversation) | (null > null);
export const ConversationDispatchContext = React.createContext(null);

export default function ConversationProvider(children) {
  const [conversation, dispatchconversation] = useReducer(conversationRed, {});
  return (
    <ConversationContext.Provider value={conversation}>
      <ConversationDispatchContext.Provider value={dispatchconversation}>
        {children}
      </ConversationDispatchContext.Provider>
    </ConversationContext.Provider>
  );
}
const conversationRed = (state, action) => {
  switch (action.type) {
    case "set": {
      return action.user;
    }
  }
};
