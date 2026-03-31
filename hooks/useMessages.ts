// Hook for real-time messages
import { useState } from "react";

export function useMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  return { messages, setMessages };
}
