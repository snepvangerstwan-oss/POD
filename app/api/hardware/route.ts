import { NextResponse } from "next/server";
import { handleHardwareEvent } from "@/app/backend/hardwareLogic";
import { getFrontendPod } from "@/app/backend/podApi";

export async function GET() {
  try {
    const pod = getFrontendPod("pod-1");

    if (!pod) {
      return NextResponse.json({ error: "Pod not found" }, { status: 404 });
    }

    return NextResponse.json(pod, { status: 200 });
  } catch (error) {
    console.error("GET API ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { podId, event } = body;

    if (!podId || !event) {
      return NextResponse.json(
        { error: "Missing podId or event" },
        { status: 400 }
      );
    }

    handleHardwareEvent(podId, event);

    const updatedPod = getFrontendPod(podId);

    if (!updatedPod) {
      return NextResponse.json({ error: "Pod not found" }, { status: 404 });
    }

    console.log("UPDATED FRONTEND POD:", updatedPod);

    return NextResponse.json(updatedPod, { status: 200 });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}