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
      if (JWT_SECRET) {
        verify(token, JWT_SECRET);
      } else {
        return NextResponse.json(
          { error: "Theres no secret key provide in server" },
          { status: 500 }
        );
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const query = groq`
      *[_type == "information" && expired_at > now()] | order(_createdAt desc) {
  _id,
  title,
  description,
  "image": image.asset->url,   
  expired_at,
  _createdAt
}

      `;

    const information = await client.fetch(query);
    return NextResponse.json({ information });
  } catch (error) {
    console.error("Error fetching information:", error);
    return NextResponse.json(
      { error: "Error fetching information" },
      { status: 500 }
    );
  }
}
