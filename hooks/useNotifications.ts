// Hook for real-time notifications
import { useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  return { notifications, setNotifications };
}
