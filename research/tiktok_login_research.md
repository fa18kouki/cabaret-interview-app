# TikTok Login Kit 実装可能性調査

## 概要

TikTok Login Kitは、OAuth 2.0プロトコルに基づいた認証システムで、ウェブアプリ、モバイルアプリ、デスクトップアプリに実装可能です。

## 実装フロー

1. **アプリ登録**: TikTok for Developersでアプリを登録し、Client KeyとClient Secretを取得
2. **リダイレクトURI設定**: 認証後のリダイレクト先URLを登録（最大10個、HTTPS必須）
3. **CSRF対策トークン生成**: ランダムな文字列を生成してセッションに保存
4. **認可リクエスト**: ユーザーをTikTokの認可ページにリダイレクト
5. **ユーザー認証**: ユーザーがTikTokアカウントで認証し、権限を許可
6. **認可コード取得**: コールバックURLに認可コードが返される
7. **アクセストークン取得**: 認可コードを使ってアクセストークンを取得
8. **ユーザー情報取得**: アクセストークンを使ってユーザー情報を取得

## 取得可能なユーザー情報

### 利用可能なスコープ

| スコープ | 説明 | 取得できる情報 |
| :--- | :--- | :--- |
| `user.info.basic` | ユーザーの基本プロフィール情報 | Open ID、アバター、表示名 |
| `user.info.profile` | 追加のプロフィール情報 | プロフィールリンク、自己紹介、認証ステータス |
| `user.info.stats` | ユーザーの統計データ | いいね数、フォロワー数、フォロー数、動画数 |
| `video.list` | ユーザーの公開動画 | 公開されているTikTok動画のリスト |

### 基本的な取得情報（user.info.basic）
- **Open ID**: TikTokの一意のユーザーID
- **Display Name**: 表示名
- **Avatar URL**: プロフィール画像URL

## 認可URL例

```
https://www.tiktok.com/v2/auth/authorize/?
  client_key={CLIENT_KEY}&
  scope=user.info.basic&
  response_type=code&
  redirect_uri={REDIRECT_URI}&
  state={CSRF_STATE}
```

## 必須パラメータ

| パラメータ | 説明 |
| :--- | :--- |
| `client_key` | アプリのクライアントキー |
| `scope` | 取得する権限（カンマ区切り） |
| `response_type` | `code`固定 |
| `redirect_uri` | コールバックURL（登録済みのURLと完全一致） |
| `state` | CSRF防止用のランダム文字列 |

## リダイレクトURIの制約

- **最大10個**まで登録可能
- **各URIは512文字以内**
- **HTTPS必須**（例: `https://dev.example.com/auth/callback/`）
- **静的URLのみ**（パラメータは不可）
- **フラグメント（#）は不可**

## ユーザー識別方法

**Open ID**を使用してユーザーを一意に識別できます。このIDは：
- TikTok内で一意
- 変更されない
- アプリごとに同じ値

## 実装可能性

✅ **実装可能**

- OAuth 2.0標準に準拠
- 公式ドキュメントが充実
- ウェブアプリ、モバイルアプリ、デスクトップアプリに対応
- ユーザー識別に必要な情報（Open ID）が取得可能
- 若年層、特に女性ユーザーに人気が高い

## メリット

- **若年層への訴求力**: 特に10代〜20代の女性ユーザーに圧倒的な人気
- **グローバル対応**: 世界中で利用されているため、将来的な海外展開にも対応
- **シンプルな実装**: OAuth 2.0標準に準拠しており、実装が容易
- **豊富な情報**: プロフィール情報だけでなく、統計データも取得可能

## 注意点

- **HTTPS必須**: リダイレクトURIはHTTPSである必要がある
- **リダイレクトURIの完全一致**: 登録したURLと完全に一致する必要がある
- **トークンのセキュリティ**: アクセストークンとリフレッシュトークンはサーバー側で安全に管理する必要がある
- **スコープの申請**: 一部のスコープは事前申請が必要な場合がある

## 参考URL

- [Login Kit for Web | TikTok for Developers](https://developers.tiktok.com/doc/login-kit-web/)
- [Manage User Access Tokens with OAuth v2 | TikTok for Developers](https://developers.tiktok.com/doc/login-kit-manage-user-access-tokens/)
- [Scopes Reference | TikTok for Developers](https://developers.tiktok.com/doc/tiktok-api-scopes)
