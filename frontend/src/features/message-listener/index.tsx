import { Store } from "@reduxjs/toolkit";
import { RootState } from "features/redux/store";
import { useEffect } from "react"
import MessageType from "types/browser-message-types";
import getBrowser from "utils/get-browser";

const currentIdSelector = (state: RootState) => state.playlist.currentId;

type Props = {
  store: Store<RootState>;
};

const MessageListener = ({ store }: Props) => {
  useEffect(() => {
    getBrowser.addMessageListener((message, response) => {
      if (message.type === MessageType.getId) {
        response(currentIdSelector(store.getState()));
      }
    });
  }, [ store ]);

  return null;
};

export default MessageListener;