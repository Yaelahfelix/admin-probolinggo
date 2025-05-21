import { client } from "@/sanity/lib/client";
import { verify } from "jsonwebtoken";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

type tParams = Promise<{ slug: string[] }>;

export async function GET(
  request: NextRequest,
  props: { params: tParams }
): Promise<NextResponse> {
  const { slug } = await props.params;
  try {
    // Get the authorization header
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
        *[_type == "post" && slug.current == $slug] {
          _id,
          title,
          description,
          "slug": slug.current,
          mainImage,
          body,
          _createdAt
        }
      `;

    const posts = await client.fetch(query, { slug });

    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: posts[0] });
  } catch (error) {
    console.error("Error fetching post detail:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
