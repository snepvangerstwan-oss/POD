import { getPodById, startSession, endSession, reservePod, resetPod, cancelReservation } from "./podLogic";
import { StorePods } from "./store";

export function ifButtonPressed(podId: string): void {
  const pod = getPodById(podId);
  if (!pod) return;

  const now = Date.now();

  if (
    pod.lastButtonPressAt &&
    now - pod.lastButtonPressAt.getTime() < 1200
  ) {
    console.log("Ignored button press: too soon");
    return;
  }

  pod.lastButtonPressAt = new Date();
  pod.ButtonPressed = true;

  if (pod.status === "Reserved") {
    startSession(podId, "Button");
    return;
  }

  if (pod.status === "Occupied") {
    if (
      pod.sessionStartedBy === "Button" ||
      pod.sessionStartedBy === "app"
    ) {
      endSession(podId);
      return;
    }

    if (pod.sessionStartedBy === "Presence") {
      console.log("Ignored button press: session started by presence");
      return;
    }
  }
}

// Problem note:
// if sensor already sets status to Occupied and user presses button,
// it could end the session when they actually meant to start it.

export function ifPresenceDetected(podId: string): void {
  const pod = getPodById(podId);
  if (!pod) return;

  pod.PresenceDetected = true;

  if (pod.status === "Reserved") {
    // only set motionStart once, when presence first begins
    if (!pod.motionStart) {
      pod.motionStart = new Date();
    }
  } else if (pod.status === "Occupied") {
    // user is back, so cancel grace period
    pod.GracePeriod = null;
  }
}
 // grace period of 15 minutes if presence is no longer detected 
export function ifPresenceLost(podId: string): void {
  const pod = getPodById(podId);
  if (!pod) return;

  pod.PresenceDetected = false;

  if (pod.status === "Occupied") {
    pod.GracePeriod = new Date(Date.now() + 30 * 1000); // 30 seconds
  }

  if (pod.status === "Reserved") {
    pod.motionStart = null;
  }
}



export function ifReservationExpires(podId: string): void {
  const pod = getPodById(podId);
  if (!pod) return;

  if (
    pod.status === "Reserved" &&
    pod.ReservationExpiry &&
    Date.now() >= pod.ReservationExpiry.getTime()
  ) {
    console.log("RESERVATION EXPIRED:", {
      podId: pod.id,
      status: pod.status,
      ReservationExpiry: pod.ReservationExpiry.toISOString(),
      now: new Date().toISOString(),
      diffSeconds: Math.floor(
        (pod.ReservationExpiry.getTime() - Date.now()) / 1000
      ),
    });

    resetPod(podId);
  }
}

export function ifSessionEnds(podId: string): void {
  const pod = getPodById(podId);
  if (!pod) return;

  if (
    pod.status === "Occupied" &&
    pod.SessionEnd &&
    Date.now() >= pod.SessionEnd.getTime()
  ) {
    pod.status = "Leaving";
    pod.ledLights = "Yellow";
    pod.blueLedOn = false;

    pod.LeavingPodEnd = new Date(Date.now() + 5 * 1000); // 5 seconds
    pod.SessionEnd = null;
    pod.GracePeriod = null;
    pod.motionStart = null;
  }
}

export function ifLeavingPods(podId: string): void {
  const pod = getPodById(podId);
  if (!pod) return;

  if (
    pod.status === "Leaving" &&
    pod.LeavingPodEnd &&
    Date.now() >= pod.LeavingPodEnd.getTime()
  ) {
    resetPod(podId);
  }
}

export function ifGracePeriodEnds(podId: string): void {
  const pod = getPodById(podId);
  if (!pod) return;

  if (
    pod.status === "Occupied" &&
    pod.GracePeriod &&
    Date.now() >= pod.GracePeriod.getTime()
  ) {
   resetPod(podId);
  }
}

export function ifMotionTimerEnds(podId: string): void {
  const pod = getPodById(podId);
  if (!pod) return;

  if (
    pod.status === "Reserved" &&
    pod.PresenceDetected &&
    pod.motionStart &&
    Date.now() >= pod.motionStart.getTime() + 6 * 1000 //6 seconds 
  ) {
    startSession(podId, "Presence");
    pod.motionStart = null;
  }
}

export function checkAllPods(): void {
  for (const pod of StorePods) {
    ifMotionTimerEnds(pod.id);
    ifReservationExpires(pod.id);
    ifSessionEnds(pod.id);
    ifGracePeriodEnds(pod.id);
    ifLeavingPods(pod.id);

    console.log("AFTER CHECK ALL PODS:", getPodById(pod.id));
  }
}

export function handleHardwareEvent(podId: string, event: string) {
  console.log("EVENT RECEIVED:", event, podId);
  console.log("POD BEFORE EVENT:", getPodById(podId));

  if (event === "button_pressed") {
    ifButtonPressed(podId);
  } else if (event === "presence_detected") {
    ifPresenceDetected(podId);
  } else if (event === "presence_lost") {
    ifPresenceLost(podId);
  } else if (event === "reserve_pod") {
    reservePod(podId, "1234");
    console.log("AFTER RESERVE:", getPodById(podId));
  } else if (event === "cancel_reservation") {
    cancelReservation(podId);
  } else {
    throw new Error(`Unknown event: ${event}`);
  }

  checkAllPods();

  console.log("ALL PODS:", StorePods);
  console.log("FOUND POD:", getPodById(podId));

  return getPodById(podId);
}