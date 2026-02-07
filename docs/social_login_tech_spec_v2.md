# SNSログイン機能 技術仕様書 v2

## 1. 概要

本ドキュメントは、キャバクラ面接アプリに実装するSNSログイン機能（LINE, TikTok, X）の技術的な仕様を定義するものです。

## 2. 機能要件

- ユーザーは、LINE、TikTok、またはXのアカウントを利用して、アプリへの新規登録およびログインができる。
- 初回ログイン時に、各SNSから取得したユーザー情報をアプリのユーザーデータベースに保存する。
- 2回目以降のログイン時には、各SNSのユーザーIDを元に既存のユーザーアカウントと紐付け、ログイン状態を復元する。

## 3. 実装アーキテクチャ

### 3.1. 認証フロー（OAuth 2.0 認可コードフロー）

1.  **[フロントエンド]** ユーザーが「LINEでログイン」「TikTokでログイン」「Xでログイン」のいずれかのボタンをクリック。
2.  **[フロントエンド]** 各SNSの認可エンドポイントへリダイレクト。この際、`client_id`, `redirect_uri`, `scope`, `state`、およびXの場合は`code_challenge`をパラメータとして付与する。
3.  **[SNSプラットフォーム]** ユーザーがSNSアカウントで認証し、アプリへの情報提供を許可する。
4.  **[SNSプラットフォーム]** `redirect_uri`に指定されたバックエンドのエンドポイントへ、`code`（認可コード）と`state`を付与してリダイレクト。
5.  **[バックエンド]** `state`を検証し、CSRF攻撃でないことを確認。
6.  **[バックエンド]** 受け取った`code`と`client_id`, `client_secret`（およびXの場合は`code_verifier`）を使い、各SNSのトークンエンドポイントへリクエストを送信し、`access_token`を取得。
7.  **[バックエンド]** `access_token`を利用して、各SNSのAPIからユーザー情報を取得（ユーザーID、表示名、メールアドレスなど）。
8.  **[バックエンド]** 取得したSNSのユーザーIDをキーにして、アプリのユーザーデータベースを検索。
    - **ユーザーが存在する場合**: ログイン成功。アプリ独自の認証トークン（JWTなど）を生成し、フロントエンドに返す。
    - **ユーザーが存在しない場合**: 新規ユーザーとしてデータベースに情報を保存し、ログイン成功。同様に認証トークンを生成して返す。
9.  **[フロントエンド]** バックエンドから受け取った認証トークンを保存し、ログイン状態とする。

### 3.2. データベース設計

`users`テーブルに、SNSごとのユーザーIDを格納するカラムを追加します。

**usersテーブル**

| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | `BIGINT`, `PK` | 主キー |
| `name` | `VARCHAR(255)` | 表示名 |
| `email` | `VARCHAR(255)` | メールアドレス |
| `line_user_id` | `VARCHAR(255)`, `UNIQUE` | LINEのユーザーID |
| `tiktok_open_id` | `VARCHAR(255)`, `UNIQUE` | TikTokのOpen ID |
| `x_user_id` | `VARCHAR(255)`, `UNIQUE` | X (Twitter)のユーザーID |
| `created_at` | `TIMESTAMP` | 作成日時 |
| `updated_at` | `TIMESTAMP` | 更新日時 |

- 各SNSのIDカラムにはUNIQUE制約を設定し、重複登録を防ぎます。

## 4. 各SNS APIのエンドポイントとパラメータ

### 4.1. LINE Login

- **認可エンドポイント**: `https://access.line.me/oauth2/v2.1/authorize`
- **スコープ**: `profile openid email`
- **トークンエンドポイント**: `https://api.line.me/oauth2/v2.1/token`
- **ユーザー情報取得エンドポイント**: `https://api.line.me/v2/profile`

### 4.2. TikTok Login

- **認可エンドポイント**: `https://www.tiktok.com/v2/auth/authorize/`
- **スコープ**: `user.info.basic`
- **トークンエンドポイント**: `https://open-api.tiktok.com/oauth/access_token/`
- **ユーザー情報取得エンドポイント**: `https://open-api.tiktok.com/v2/user/info/`

### 4.3. X (Twitter) Login

- **認可エンドポイント**: `https://x.com/i/oauth2/authorize`
- **スコープ**: `users.read tweet.read users.email`
- **トークンエンドポイント**: `https://api.x.com/2/oauth2/token`
- **ユーザー情報取得エンドポイント**: `https://api.x.com/2/users/me`
- **注意**: PKCE (Proof Key for Code Exchange) の実装が必須です。

## 5. セキュリティ考慮事項

- **CSRF対策**: 認可リクエスト時に`state`パラメータを使用し、コールバック時に検証します。
- **PKCE (X Login)**: Xの認証では、`code_challenge`と`code_verifier`を用いたPKCEを実装し、認可コードの横取り攻撃を防ぎます。
- **シークレットキーの管理**: `client_secret`などの秘密情報は、環境変数などを用いて安全に管理し、コード中にハードコーディングしません。
- **HTTPSの強制**: 全ての通信はHTTPSで行います。特にコールバックURLは必ずHTTPSである必要があります。
