// Hook for accessing current user data
import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  return { user };
}
