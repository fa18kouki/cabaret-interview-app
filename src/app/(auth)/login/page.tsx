import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ログイン</h1>
          <p className="mt-2 text-gray-600">キャバクラ面接アプリにログイン</p>
        </div>

        <div className="mt-8">
          <SocialLoginButtons callbackUrl="/" />
        </div>

        <div className="text-center">
          <a href="/" className="text-sm text-pink-600 hover:text-pink-700">
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
