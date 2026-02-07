# X (Twitter) Login 実装可能性調査

## 概要

X (旧Twitter)は、OAuth 2.0 Authorization Code Flow with PKCEをサポートしており、ウェブアプリやモバイルアプリでのログイン機能を実装できます。

## 実装フロー

1. **アプリ登録**: X Developer Portalでアプリを作成し、OAuth 2.0を有効化
2. **認可URL生成**: ユーザーを認可エンドポイントにリダイレクト
3. **ユーザー認証**: ユーザーがXアカウントで認証し、アプリへの権限を許可
4. **認可コード取得**: コールバックURLに認可コードが返される
5. **アクセストークン取得**: 認可コードを使ってアクセストークンを取得
6. **ユーザー情報取得**: アクセストークンを使ってユーザー情報を取得

## 取得可能なユーザー情報

### 利用可能なスコープ

| スコープ | 説明 |
| :--- | :--- |
| `users.read` | ユーザーの基本情報（ID、ユーザー名、表示名など）を取得 |
| `users.email` | ユーザーのメールアドレスを取得 |
| `tweet.read` | ユーザーのツイートを閲覧 |
| `follows.read` | フォロー・フォロワー情報を取得 |
| `offline.access` | リフレッシュトークンを取得（長期間のアクセス） |

### 基本的な取得情報
- **User ID**: Xの一意のユーザーID
- **Username**: @から始まるユーザー名
- **Display Name**: 表示名
- **Profile Image**: プロフィール画像URL
- **Email**: メールアドレス（`users.email`スコープが必要）

## 認可URL例

```
https://x.com/i/oauth2/authorize?
  response_type=code&
  client_id=M1M5R3BMVy13QmpScXkzTUt5OE46MTpjaQ&
  redirect_uri=https://www.example.com&
  scope=tweet.read%20users.read%20users.email&
  state=xyz&
  code_challenge=ABC123&
  code_challenge_method=S256
```

## 必須パラメータ

| パラメータ | 説明 |
| :--- | :--- |
| `response_type` | `code`固定 |
| `client_id` | Developer Consoleで取得したクライアントID |
| `redirect_uri` | コールバックURL（完全一致が必要） |
| `state` | CSRF防止用のランダム文字列（最大500文字） |
| `code_challenge` | PKCE用のランダムシークレット |
| `code_challenge_method` | `S256`または`plain` |
| `scope` | 取得する権限（スペース区切り） |

## PKCEについて

X API OAuth 2.0では、**PKCE (Proof Key for Code Exchange)** が必須です。これはセキュリティを強化するための仕組みで、以下の手順で実装します：

1. **Code Verifier生成**: ランダムな文字列（43〜128文字）を生成
2. **Code Challenge生成**: Code VerifierをSHA256でハッシュ化してBase64URLエンコード
3. **認可リクエスト**: `code_challenge`と`code_challenge_method=S256`を含める
4. **トークンリクエスト**: `code_verifier`を含める

## ユーザー識別方法

**User ID**を使用してユーザーを一意に識別できます。このIDは：
- X内で一意
- 変更されない
- アプリごとに同じ値（OAuth 1.0aとは異なる）

## 実装可能性

✅ **実装可能**

- OAuth 2.0標準に準拠（PKCE必須）
- 公式ドキュメントが充実
- ユーザー識別に必要な情報（User ID）が取得可能
- メールアドレスも取得可能

## 注意点

- **PKCE必須**: OAuth 2.0ではPKCEの実装が必須
- **認可コードの有効期限**: 30秒以内にアクセストークンと交換する必要がある
- **コールバックURLの完全一致**: リダイレクトURIは登録したURLと完全に一致する必要がある
- **API利用制限**: X APIには利用制限があり、プランによって異なる

## 参考URL

- [OAuth 2.0 Authorization Code Flow with PKCE | X Developer Platform](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code)
- [OAuth 2.0 Overview | X Developer Platform](https://docs.x.com/fundamentals/authentication/oauth-2-0/overview)
