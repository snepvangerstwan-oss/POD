import { getPodById } from "./podLogic";
import { StorePods } from "./store";
import { checkAllPods } from "./hardwareLogic";

function getMinutesRemaining(date: Date | null): number {
  if (!date) return 0;

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.ceil(diffMs / 60000);

  return Math.max(diffMinutes, 0);
}

export function getFrontendPod(podId: string) {
  checkAllPods();

  const pod = getPodById(podId);
  if (!pod) return null;

  let minutesRemaining = 0;

  if (pod.status === "Reserved" && pod.ReservationExpiry) {
    minutesRemaining = getMinutesRemaining(pod.ReservationExpiry);
  } else if (pod.status === "Occupied" && pod.SessionEnd) {
    minutesRemaining = getMinutesRemaining(pod.SessionEnd);
  } else if (pod.status === "Leaving" && pod.LeavingPodEnd) {
    minutesRemaining = getMinutesRemaining(pod.LeavingPodEnd);
  } else if (pod.GracePeriod) {
    minutesRemaining = getMinutesRemaining(pod.GracePeriod);
  }

  return {
    id: pod.id,
    name: pod.name,
    status: pod.status,
    ledLights: pod.ledLights,
    accessCode: pod.accessCode,

    ReservationExpiry: pod.ReservationExpiry
      ? pod.ReservationExpiry.toISOString()
      : null,

    SessionEnd: pod.SessionEnd
      ? pod.SessionEnd.toISOString()
      : null,

    LeavingPodEnd: pod.LeavingPodEnd
      ? pod.LeavingPodEnd.toISOString()
      : null,

    GracePeriod: pod.GracePeriod
      ? pod.GracePeriod.toISOString()
      : null,

    minutesRemaining,
    blueLedOn: pod.blueLedOn,
    sessionStartedBy: pod.sessionStartedBy,
    
    // NIEUW: Stuur de sensor-statussen mee naar de frontend!
    PresenceDetected: pod.PresenceDetected,
    ButtonPressed: pod.ButtonPressed,
  };
}

export function getAllFrontendPods() {
  checkAllPods();

  return StorePods.map((pod) => getFrontendPod(pod.id)).filter(Boolean);
}
