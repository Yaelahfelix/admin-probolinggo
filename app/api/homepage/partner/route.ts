import { getPartners } from "@/lib/sanity-utils";
import { getCurrentSession } from "@/lib/session";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { user } = await getCurrentSession();
    if (user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize",
        },
        { status: 403 }
      );
    }

    const documents = await getPartners();

    // // await db.end();
    // console.log(data);
    return NextResponse.json(
      {
        success: true,
        data: documents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const alt = formData.get("alt") as string;

    if (!image) {
      return NextResponse.json(
        { status: 400, message: "Image is required" },
        { status: 400 }
      );
    }

    if (!alt) {
      return NextResponse.json(
        { status: 400, message: "Alt text is required" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageAsset = await client.assets.upload("image", buffer, {
      filename: image.name,
      contentType: image.type,
    });

    const result = await client.create({
      _type: "partner",
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
        alt,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Partner created successfully",
      data: {
        _id: result._id,
        alt: result.image.alt,
        image: result.image,
      },
    });
  } catch (error) {
    console.error("Error processing partner document:", error);
    return NextResponse.json(
      { status: 500, message: "Error processing partner document" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get("id");

    if (!partnerId) {
      return NextResponse.json(
        {
          status: 400,
          message: "Partner ID is required",
        },
        { status: 400 }
      );
    }
    await client.delete(partnerId);

    return NextResponse.json({
      status: 200,
      message: "Partner deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: "Error deleting Partner",
      },
      { status: 500 }
    );
  }
}
