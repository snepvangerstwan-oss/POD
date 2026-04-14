import { StorePods } from "./store";

export function getPodById(id: string) {
  return StorePods.find((pod) => pod.id === id) || null;
}

export function updatePodStatus(id: string, newStatus: string) {
  const pod = getPodById(id);
  if (!pod) return null;

  pod.status = newStatus as any; // fix typing later
  return pod;
}

export function reservePod(id: string, accessCode: string) {
  const pod = getPodById(id);

  console.log("BEFORE RESERVE:", pod);

  if (!pod) return null;

  if (pod.status === "Available") {
    pod.status = "Reserved";
    pod.ledLights = "Yellow";
    pod.blueLedOn = false;

    pod.accessCode = accessCode;
    pod.ReservationExpiry = new Date(Date.now() + 30 * 1000);

    // clear all old session / temporary state
    pod.sessionStartedBy = null;
    pod.motionStart = null;
    pod.GracePeriod = null;
    pod.LeavingPodEnd = null;
    pod.SessionStart = null;
    pod.SessionEnd = null;

    // also clear old input state
    pod.ButtonPressed = false;
    pod.PresenceDetected = false;
    pod.lastButtonPressAt = null;
  }

  console.log("AFTER RESERVE:", pod);
  return pod;
}

export function cancelReservation(id: string) {
  const pod = getPodById(id);
  if(!pod) return;

  if (pod.status === "Reserved") {
    return resetPod(id);
  }
  return pod;
}

export function startSession(
  id: string,
  startedBy: "Button" | "Presence" | "app"
) {
  const pod = getPodById(id);
  if (!pod) return null;

  if (pod.status === "Reserved" || pod.status === "Available") {
    pod.status = "Occupied";
    pod.ledLights = "Red";
    pod.blueLedOn = true;
    pod.sessionStartedBy = startedBy;

    pod.SessionStart = new Date();
    pod.SessionEnd = new Date(pod.SessionStart.getTime() +  120 * 1000); // 2 hours now 120 seconds
    
    pod.ReservationExpiry = null;
    pod.motionStart = null;
    pod.LeavingPodEnd = null;
   
  }

  return pod;
}

export function endSession(id: string) {
  const pod = getPodById(id);
  if (!pod) return null;

  if (pod.status === "Occupied") {
    pod.status = "Leaving";
    pod.ledLights = "Yellow";
    pod.blueLedOn = false;

    pod.LeavingPodEnd = new Date(Date.now() + 5 * 1000); // 5 seconds
    pod.SessionEnd = null;
    pod.GracePeriod = null;
    pod.motionStart = null;
  }

  return pod;
}

export function resetPod(id: string) {
  const pod = getPodById(id);
  if (!pod) return null;

  pod.status = "Available";
  pod.ledLights = "Green";
  pod.blueLedOn = false;

  pod.accessCode = null;
  pod.ReservationExpiry = null;
  pod.SessionStart = null;
  pod.SessionEnd = null;
  pod.motionStart = null;
  pod.LeavingPodEnd = null;
  pod.GracePeriod = null;

  pod.ButtonPressed = false;
  pod.PresenceDetected = false;

  pod.sessionStartedBy = null;
  pod.lastButtonPressAt = null;

  return pod;
}
