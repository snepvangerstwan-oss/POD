export type PodStatus = "Available" | "Reserved" | "Occupied" | "Leaving";
export type LedLights = "Green" | "Yellow" | "Red";
export type SessionStartedBy = "Button" | "Presence"| "app" | null;

export interface Pod {
  id: string;
  name: string;
  status: PodStatus;
  ledLights: LedLights;


  accessCode: string | null;

  ReservationExpiry: Date | null;
  SessionStart: Date | null;
  SessionEnd: Date | null;
  LeavingPodEnd: Date | null;
  GracePeriod: Date | null;
  motionStart: Date | null;

  ButtonPressed: boolean;
  PresenceDetected: boolean;

  blueLedOn: boolean;
  sessionStartedBy: SessionStartedBy;
  lastButtonPressAt: Date | null;
}