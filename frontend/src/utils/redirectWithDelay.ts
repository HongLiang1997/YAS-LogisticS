export default function redirectWithDelay(location: string, delayMillisecond = 2000) {
  setTimeout(() => {
    window.location.href = location;
  }, delayMillisecond);
}