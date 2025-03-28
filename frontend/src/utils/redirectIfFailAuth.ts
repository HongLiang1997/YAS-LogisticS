import Cookies from "js-cookie";
import redirectWithDelay from "@/utils/redirectWithDelay";
import { notifications } from '@mantine/notifications';

/**
 * Checks if session token exists in cookie.
 *
 * If it doesn't exist, flash notification that authentication failed, redirecting to login page...
 *
 * @return True if authentication failed.
 */
export default function redirectIfFailAuth() {
  const token = Cookies.get("token")

  if (token === undefined) {
    console.warn("Cookie not found.");
    notifications.show({
      title: "Authentication failed",
      message: "Please login again!",
      color: 'red'
    })
    redirectWithDelay("/")
    return true;
  }

  return false;
}