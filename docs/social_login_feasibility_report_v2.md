# SNSログイン機能 実装可能性調査レポート v2

## 1. 調査目的

本レポートは、キャバクラ面接アプリにおいて、ユーザーの利便性向上を目的とした各種SNS（LINE, X, TikTok, Instagram, Facebook）によるログイン機能の実装可能性を評価し、その結果を報告するものです。

## 2. 調査サマリー

| SNS | 実装可能性 | ターゲット親和性 | 結論・推奨事項 |
| :--- | :--- | :--- | :--- |
| **LINE Login** | ✅ **実装可能** | ◎ (非常に高い) | **最優先で実装を推奨**します。 |
| **TikTok Login** | ✅ **実装可能** | ◎ (非常に高い) | **強く推奨**します。若年層への訴求力が絶大です。 |
| **X (Twitter) Login** | ✅ **実装可能** | ○ (高い) | **推奨**します。匿名性を好むユーザー層に有効です。 |
| **Instagram Login** | ❌ **実装不可** | - | API廃止のため実装できません。 |
| **Facebook Login** | ✅ **実装可能** | △ (やや低い) | Instagramの代替として**検討可能**ですが、優先度は低いです。 |

## 3. 各SNSログイン機能の詳細評価

### 3.1. LINE Login (最優先推奨)

- **実装可能性**: **可能**です。OAuth 2.0およびOpenID Connectに準拠しており、実装は容易です。
- **ユーザー識別**: `userId`により一意のユーザー識別が可能です。
- **ターゲット親和性**: 日本国内、特に若年層の利用率が非常に高く、本アプリの主要ターゲットと完全に合致しています。
- **メリット**: ユーザーにとって最も手軽で安心感のあるログイン方法であり、コンバージョン率の向上が最も期待できます。

### 3.2. TikTok Login (強く推奨)

- **実装可能性**: **可能**です。OAuth 2.0に準拠したLogin Kitが提供されています。
- **ユーザー識別**: `Open ID`により一意のユーザー識別が可能です。
- **ターゲット親和性**: 10代〜20代の女性に絶大な人気を誇り、LINEと並んでターゲット親和性が非常に高いです。
- **メリット**: 若年層への強力なアピールとなり、アプリの認知度向上にも繋がる可能性があります。

### 3.3. X (Twitter) Login (推奨)

- **実装可能性**: **可能**です。OAuth 2.0 (PKCE必須) に対応しています。
- **ユーザー識別**: `User ID`により一意のユーザー識別が可能です。メールアドレスも取得できます。
- **ターゲット親和性**: 匿名での情報収集やコミュニケーションを好むユーザー層にリーチできます。
- **メリット**: 匿名性を重視するユーザーの登録ハードルを下げることができます。
- **注意点**: PKCEの実装が必須である点に留意が必要です。

### 3.4. Instagram Login (実装不可)

- **実装可能性**: **不可能**です。一般ユーザー向けの「Instagram Basic Display API」は**2024年12月4日に廃止**されました。
- **結論**: Instagramアカウントを利用した直接のログイン機能は実装できません。

### 3.5. Facebook Login (検討可能)

- **実装可能性**: **可能**です。OAuth 2.0に対応しており、実装は容易です。
- **ユーザー識別**: `userID`により一意のユーザー識別が可能です。
- **ターゲット親和性**: 日本の若年層におけるアクティブ率はLINEやTikTok、Xと比較してやや低く、優先度は高くありません。
- **メリット**: Instagramアカウントと連携しているユーザーを取り込める可能性があります。

## 4. 結論と推奨事項

以上の調査結果から、キャバクラ面接アプリのSNSログイン機能として、以下の優先順位で実装することを推奨します。

**推奨する実装**

1.  **LINE Login**: **最優先**。最も高いコンバージョンが期待できます。
2.  **TikTok Login**: **強く推奨**。若年層への訴求力を最大化します。
3.  **X (Twitter) Login**: **推奨**。匿名性を好むユーザー層をカバーします。

まずは**LINE Login**を必須とし、開発リソースに余裕があれば**TikTok**、**X**の順で追加実装するのが最も効果的な戦略と考えられます。

## 5. 参考資料

- [ウェブアプリにLINEログインを組み込む | LINE Developers](https://developers.line.biz/ja/docs/line-login/integrate-line-login/)
- [Login Kit for Web | TikTok for Developers](https://developers.tiktok.com/doc/login-kit-web/)
- [OAuth 2.0 Authorization Code Flow with PKCE | X Developer Platform](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code)
- [Instagram Basic Display APIに関する最新情報 | Meta for Developers](https://developers.facebook.com/blog/post/2024/09/04/update-on-instagram-basic-display-api/)
