import db from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize",
        },
        { status: 401 }
      );
    }
    const [data] = await db.query(
      "select id,nama,alamat,no_hp, flaghub, hub_at, hub_by, flagproses, proses_at, proses_by from web_user_daftarpsb;"
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
    return NextResponse.json(
      {
        message: "Internal server error!",
        error,
      },
      { status: 500 }
    );
  }
}
