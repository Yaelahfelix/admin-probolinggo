import { getStatistics } from "@/lib/sanity-utils";
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

    const documents = await getStatistics();

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

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { _id, id_icon, value, type_value, title } = body;
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

    if (!_id || !id_icon || !value || !title) {
      return NextResponse.json(
        {
          status: 400,
          message:
            "All fields (_id, id_icon, value, type_value, title) are required",
        },
        { status: 400 }
      );
    }

    const result = await client
      .patch(_id)
      .set({
        id_icon,
        value,
        type_value,
        title,
      })
      .commit();

    return NextResponse.json({
      status: 200,
      message: "Statistic updated successfully",
      data: {
        _id: result._id,
        id_icon: result.id_icon,
        value: result.value,
        type_value: result.type_value,
        title: result.title,
      },
    });
  } catch (error) {
    console.error("Error updating statistics document:", error);
    return NextResponse.json(
      { status: 500, message: "Error updating statistics document" },
      { status: 500 }
    );
  }
}
