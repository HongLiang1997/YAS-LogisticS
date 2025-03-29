export default function refreshWithDelay(delayMillisecond = 2000) {
  setTimeout(() => {
    window.location.reload();
  }, delayMillisecond);
}