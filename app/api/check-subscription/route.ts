import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "guest@demo.com";

    // Replicate database checks or premium user tiers.
    // In our live applet, users with "pro@" or checked in localStorage are treated as Pro.
    // Checking mock database values or standard clerk properties.
    const isPaid = email.toLowerCase().includes("pro") || email.includes("premium") || email.includes("alex.sterling");

    return NextResponse.json({ isPaid });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
