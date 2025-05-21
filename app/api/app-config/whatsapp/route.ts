import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      if (!JWT_SECRET) {
        return NextResponse.json(
          { error: "No secret key provided in server" },
          { status: 500 }
        );
      }
      verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const query = groq`*[_type == "appConfig"][0].whatsappNumber`;
    const whatsappNumber = await client.fetch(query);
    return NextResponse.json({ whatsappNumber });
  } catch (error) {
    console.error("Error fetching WhatsApp number:", error);
    return NextResponse.json(
      { error: "Error fetching WhatsApp number" },
      { status: 500 }
    );
  }
}
