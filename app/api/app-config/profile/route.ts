import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";

interface User {
  //
  id: number;
  email: string;
  nama: string | null;
  image: string | null;
  status: boolean;
}

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
    const [data] = await db.query<RowDataPacket[]>(
      'select * from app_configuration where name = "profile"',
      []
    );

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}

export async function PUT(request: Request) {
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

    const data = await request.json();

    const [result] = await db.query<RowDataPacket[]>(
      'UPDATE app_configuration SET data = ? WHERE name = "profile"',
      [JSON.stringify(data)]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Company profile updated successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
