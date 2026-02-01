import Link from "next/link";

const legalLinks = [
  { label: "プライバシーポリシー", href: "#" },
  { label: "利用規約", href: "#" },
  { label: "特定商取引法に基づく表記", href: "#" },
];

const supportInfo = [
  { label: "苦情処理窓口" },
  { label: "メール: support@lumina.jp" },
  { label: "届け出番号: 職業紹介 XX-XX-XXXXXX", small: true },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">LUMINA</h3>
            <p className="text-sm">
              AIを活用した、新しい働き方マッチングサービス
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">法的情報</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">サポート</h4>
            <ul className="space-y-2">
              {supportInfo.map((item) => (
                <li
                  key={item.label}
                  className={item.small ? "text-xs" : "text-sm"}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 店長入口 */}
        <div className="border-t border-gray-800 pt-8 mb-6">
          <p className="text-center text-sm text-gray-400">
            店長の方は
            <Link
              href="/store/login"
              className="text-white hover:underline ml-1"
            >
              こちら
            </Link>
            からログイン
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Disclaimers */}
          <div className="text-center text-xs mb-6 space-y-1">
            <p>当サービスは職業紹介事業として適切に届出を行っております。</p>
            <p>18歳未満の方はご利用いただけません。</p>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm">
            © 2026 LUMINA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
