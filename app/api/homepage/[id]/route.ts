import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const param = await params;
  const id = param.id;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM web_fe_homepage WHERE name = ? LIMIT 1",
      [id]
    );

    console.log(id);
    console.log(rows);

    const item = (rows as any[])[0];

    if (!item) {
      return NextResponse.json(
        { message: "Item Not Found", status: 404 },
        { status: 404 }
      );
    }

    let typedValue;
    try {
      typedValue = JSON.parse(item.value);
    } catch (e) {
      typedValue = item.value;
    }

    console.log(item);
    console.log(typedValue);
    return NextResponse.json(
      {
        status: 200,
        message: "Item Found",
        data: { ...item, value: typedValue },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", status: 500, error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  /* @next-codemod-ignore */
  const param = await params;
  const id = param.id;

  try {
    const body = await req.json();
    const { value } = body;

    if (!value) {
      return NextResponse.json(
        { message: "Invalid data", status: 400 },
        { status: 400 }
      );
    }

    const [existingRows] = await db.execute(
      "SELECT * FROM web_fe_homepage WHERE name = ? LIMIT 1",
      [id]
    );

    const existingItem = (existingRows as any[])[0];

    if (!existingItem) {
      return NextResponse.json(
        { message: "Item Not Found", status: 404 },
        { status: 404 }
      );
    }

    await db.execute("UPDATE web_fe_homepage SET value = ? WHERE name = ?", [
      JSON.stringify(value),
      id,
    ]);

    return NextResponse.json(
      {
        status: 200,
        message: "Item Updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", status: 500, error },
      { status: 500 }
    );
  }
}
