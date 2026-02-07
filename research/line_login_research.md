# LINE Login 実装可能性調査

## 概要

LINE Loginは、OAuth 2.0とOpenID Connectプロトコルに基づいた認証システムで、ウェブアプリやモバイルアプリに実装可能です。

## 実装フロー

1. **チャネル作成**: LINE Developersコンソールで「LINEログインチャネル」を作成
2. **コールバックURL設定**: 認証後のリダイレクト先URLを設定
3. **認証リクエスト**: ユーザーを認可URLにリダイレクト
4. **認可コード取得**: ユーザーが認証・認可後、コールバックURLに認可コードが返される
5. **アクセストークン取得**: 認可コードを使ってアクセストークンを取得
6. **ユーザー情報取得**: アクセストークンを使ってユーザー情報を取得

## 取得可能なユーザー情報

### 基本情報（profile scope）
- **userId**: LINE内部のユーザーID（一意の識別子）
- **displayName**: 表示名
- **pictureUrl**: プロフィール画像URL
- **statusMessage**: ステータスメッセージ

### メールアドレス（email scope）
- **email**: メールアドレス（事前申請が必要）

## 認可URL例

```
https://access.line.me/oauth2/v2.1/authorize?
  response_type=code&
  client_id=1234567890&
  redirect_uri=https%3A%2F%2Fexample.com%2Fauth&
  state=12345abcde&
  scope=profile%20openid&
  nonce=09876xyz
```

## 必須パラメータ

| パラメータ | 説明 |
| :--- | :--- |
| response_type | `code`固定 |
| client_id | チャネルID |
| redirect_uri | コールバックURL（URLエンコード済み） |
| state | CSRF防止用のランダム文字列 |
| scope | 取得する権限（`profile openid`など） |

## ユーザー識別方法

**userId**を使用してユーザーを一意に識別できます。このIDは：
- LINE内で一意
- 変更されない
- チャネルごとに異なる値が発行される

## 実装可能性

✅ **実装可能**

- OAuth 2.0標準に準拠しており、実装が容易
- 公式ドキュメントが充実
- SDKも提供されている
- ユーザー識別に必要な情報（userId）が取得可能

## 参考URL

- [ウェブアプリにLINEログインを組み込む | LINE Developers](https://developers.line.biz/ja/docs/line-login/integrate-line-login/)
- [LINE Login API リファレンス](https://developers.line.biz/ja/reference/line-login/)
