import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";
import { client } from "@/sanity/lib/client";
import { PublicDocument } from "@/app/admin/document-public/type";

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

    const documents: PublicDocument[] = await client.fetch(`
        *[_type == "document_public"] {
            _id,
            title,
            "file": {
            "url":file.asset->url,
            "type":file.asset->extension
            }
        }
    `);

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

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    // const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
    if (user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize",
        },
        { status: 403 }
      );
    }
    const formData = await request.formData();

    const _id = formData.get("id") as string;
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;

    let result;

    if (_id) {
      let updateOperation = client.patch(_id);

      if (title) {
        updateOperation = updateOperation.set({ title });
      }

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileAsset = await client.assets.upload("file", buffer, {
          filename: file.name,
          contentType: file.type,
        });

        const existingDoc = await client.getDocument(_id);

        updateOperation = updateOperation.set({
          file: {
            _type: "file",
            asset: {
              _type: "reference",
              _ref: fileAsset._id,
            },
          },
        });

        if (existingDoc?.file?.asset?._ref) {
          await client.delete(existingDoc.file.asset._ref);
        }
      }

      result = await updateOperation.commit();
    } else {
      if (!file) {
        return NextResponse.json(
          {
            status: 400,
            message: "File is required for new document",
          },
          {
            status: 400,
          }
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload file
      const fileAsset = await client.assets.upload("file", buffer, {
        filename: file.name,
        contentType: file.type,
      });

      // Create new document with file reference
      result = await client.create({
        _type: "document_public",
        title,
        file: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: fileAsset._id,
          },
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Succes Create Data",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        {
          status: 400,
          message: "Document ID is required",
        },
        { status: 400 }
      );
    }

    await client.delete(documentId);

    return NextResponse.json({
      status: 200,
      message: "Document deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: "Error deleting document",
      },
      { status: 500 }
    );
  }
}
