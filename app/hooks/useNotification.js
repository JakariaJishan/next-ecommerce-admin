import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";

const useEcho = () => {
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      // Use the correct event name for subscribing
      sendJsonMessage({
        event: "pusher:subscribe",
        data: {
          channel: "notifications",
        },
      });
    }
  }, [readyState, sendJsonMessage]);

  // Optionally handle incoming messages
  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessageHistory(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  return messageHistory;
};

export default useEcho;
