import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";

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
      "SELECT * FROM sipamit_billing.settingdesktop LIMIT 1",
      []
    );

    // // await db.end();
    // console.log(data);
    return NextResponse.json(
      {
        success: true,
        data: data[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
