import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createSignedUploadUrl,
  getPublicUrl,
  deleteCastPhoto,
} from "@/lib/supabase-storage";
import { prisma } from "@/server/db";

/**
 * 署名付きアップロードURL生成
 * POST /api/upload
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileExt } = body;

    if (!fileExt || typeof fileExt !== "string") {
      return NextResponse.json(
        { error: "fileExt is required" },
        { status: 400 }
      );
    }

    // 許可する拡張子
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    if (!allowedExtensions.includes(fileExt.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file extension" },
        { status: 400 }
      );
    }

    // キャストIDを取得
    const cast = await prisma.cast.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!cast) {
      return NextResponse.json({ error: "Cast not found" }, { status: 404 });
    }

    const { signedUrl, path } = await createSignedUploadUrl(cast.id, fileExt);
    const publicUrl = getPublicUrl(path);

    return NextResponse.json({
      signedUrl,
      path,
      publicUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
}

/**
 * 写真削除
 * DELETE /api/upload
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // キャストの写真かどうか確認
    const cast = await prisma.cast.findUnique({
      where: { userId: session.user.id },
      select: { id: true, photos: true },
    });

    if (!cast) {
      return NextResponse.json({ error: "Cast not found" }, { status: 404 });
    }

    // 自分の写真かどうか確認
    if (!cast.photos.includes(url)) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await deleteCastPhoto(url);

    // データベースから削除
    await prisma.cast.update({
      where: { id: cast.id },
      data: {
        photos: cast.photos.filter((p) => p !== url),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
