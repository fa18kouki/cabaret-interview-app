# SNSログイン機能 技術仕様書

## 1. 概要

本ドキュメントは、キャバクラ面接アプリに実装するSNSログイン機能（LINE Login, Facebook Login）の技術的な仕様を定義するものです。

## 2. 機能要件

- ユーザーは、LINEアカウントまたはFacebookアカウントを利用して、アプリへの新規登録およびログインができる。
- 初回ログイン時に、各SNSから取得したユーザー情報をアプリのユーザーデータベースに保存する。
- 2回目以降のログイン時には、各SNSのユーザーIDを元に既存のユーザーアカウントと紐付け、ログイン状態を復元する。

## 3. 実装アーキテクチャ

### 3.1. 認証フロー（OAuth 2.0 認可コードフロー）

1.  **[フロントエンド]** ユーザーが「LINEでログイン」または「Facebookでログイン」ボタンをクリック。
2.  **[フロントエンド]** 各SNSの認可エンドポイントへリダイレクト。この際、`client_id`, `redirect_uri`, `scope`, `state`をパラメータとして付与する。
3.  **[SNSプラットフォーム]** ユーザーがSNSアカウントで認証し、アプリへの情報提供を許可する。
4.  **[SNSプラットフォーム]** `redirect_uri`に指定されたバックエンドのエンドポイントへ、`code`（認可コード）と`state`を付与してリダイレクト。
5.  **[バックエンド]** `state`を検証し、CSRF攻撃でないことを確認。
6.  **[バックエンド]** 受け取った`code`と`client_id`, `client_secret`を使い、各SNSのトークンエンドポイントへリクエストを送信し、`access_token`と`id_token`（LINEの場合）を取得。
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
| `facebook_user_id` | `VARCHAR(255)`, `UNIQUE` | FacebookのユーザーID |
| `created_at` | `TIMESTAMP` | 作成日時 |
| `updated_at` | `TIMESTAMP` | 更新日時 |

- `line_user_id`と`facebook_user_id`にはUNIQUE制約を設定し、重複登録を防ぎます。
- 1人のユーザーが複数のSNSアカウントを連携できるようにする場合、別途`social_accounts`のようなテーブルを作成する設計も考えられますが、本仕様ではシンプルさを優先し、`users`テーブルにカラムを追加する方式とします。

## 4. 各SNS APIのエンドポイントとパラメータ

### 4.1. LINE Login

- **認可エンドポイント**: `https://access.line.me/oauth2/v2.1/authorize`
  - `scope`: `profile openid email`
- **トークンエンドポイント**: `https://api.line.me/oauth2/v2.1/token`
- **ユーザー情報取得エンドポイント**: `https://api.line.me/v2/profile`

### 4.2. Facebook Login

- **認可エンドポイント**: `https://www.facebook.com/v19.0/dialog/oauth`
  - `scope`: `public_profile,email`
- **トークンエンドポイント**: `https://graph.facebook.com/v19.0/oauth/access_token`
- **ユーザー情報取得エンドポイント**: `https://graph.facebook.com/me?fields=id,name,email`

## 5. セキュリティ考慮事項

- **CSRF対策**: 認可リクエスト時に`state`パラメータを使用し、コールバック時に検証することで、CSRF（クロスサイトリクエストフォージェリ）攻撃を防ぎます。
- **シークレットキーの管理**: `client_secret`などの秘密情報は、環境変数などを用いて安全に管理し、コード中にハードコーディングしません。
- **HTTPSの強制**: 全ての通信はHTTPSで行います。特にコールバックURLは必ずHTTPSである必要があります。
