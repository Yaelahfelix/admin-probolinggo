import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    // Extract and verify the token
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
    *[_type == "post"] | order(_createdAt desc)[0..4] {
  _id,
  title,
  description,
  "slug": slug.current,
  "mainImage": mainImage.asset->url,   
  body,
  _createdAt
} 
      `;

    const posts = await client.fetch(query);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
