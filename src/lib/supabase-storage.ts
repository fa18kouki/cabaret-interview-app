import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}

export const CAST_PHOTOS_BUCKET = "cast-photos";

/**
 * キャスト写真をSupabase Storageにアップロード
 * @param file ファイル
 * @param castId キャストID
 * @returns アップロードされた写真のURL
 */
export async function uploadCastPhoto(
  file: File,
  castId: string
): Promise<string> {
  const client = getSupabaseClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${castId}/${Date.now()}.${fileExt}`;

  const { data, error } = await client.storage
    .from(CAST_PHOTOS_BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = client.storage.from(CAST_PHOTOS_BUCKET).getPublicUrl(data.path);

  return publicUrl;
}

/**
 * キャスト写真を削除
 * @param url 写真のURL
 */
export async function deleteCastPhoto(url: string): Promise<void> {
  const client = getSupabaseClient();

  // URLからパスを抽出
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split(`/${CAST_PHOTOS_BUCKET}/`);
  if (pathParts.length !== 2) {
    throw new Error("Invalid photo URL");
  }

  const { error } = await client.storage
    .from(CAST_PHOTOS_BUCKET)
    .remove([pathParts[1]]);

  if (error) {
    throw new Error(`Failed to delete photo: ${error.message}`);
  }
}

/**
 * 署名付きアップロードURL生成（サーバーサイド用）
 * @param castId キャストID
 * @param fileExt ファイル拡張子
 * @returns 署名付きアップロードURL
 */
export async function createSignedUploadUrl(
  castId: string,
  fileExt: string
): Promise<{ signedUrl: string; path: string }> {
  const client = getSupabaseClient();
  const fileName = `${castId}/${Date.now()}.${fileExt}`;

  const { data, error } = await client.storage
    .from(CAST_PHOTOS_BUCKET)
    .createSignedUploadUrl(fileName);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return {
    signedUrl: data.signedUrl,
    path: data.path,
  };
}

/**
 * パスから公開URLを取得
 * @param path ファイルパス
 * @returns 公開URL
 */
export function getPublicUrl(path: string): string {
  const client = getSupabaseClient();
  const {
    data: { publicUrl },
  } = client.storage.from(CAST_PHOTOS_BUCKET).getPublicUrl(path);

  return publicUrl;
}
