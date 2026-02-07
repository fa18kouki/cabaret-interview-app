# Instagram/Facebook Login 実装可能性調査

## Instagram Basic Display APIの廃止

**重要**: 2024年12月4日をもって、Instagram Basic Display APIは廃止されました。

### 廃止の影響
- 一般ユーザー向けのInstagramログイン機能は利用不可
- サードパーティアプリとInstagramアカウントのリンク機能が終了
- 代替手段として、ビジネス/クリエイターアカウント向けのAPIのみ提供

## 現在利用可能なInstagram API

### 1. Instagram API with Instagram Login
- **対象**: Instagramビジネスアカウント、クリエイターアカウント
- **用途**: ビジネス向けの機能（メッセージ送受信、メディア取得/公開、コメント管理など）
- **制約**: 一般ユーザーアカウントでは利用不可

### 2. Instagram API with Facebook Login
- **対象**: FacebookページにリンクされたInstagramビジネスアカウント、クリエイターアカウント
- **用途**: ビジネス向けの機能
- **制約**: Facebookページとの連携が必須

## Facebook Loginの実装

### 概要
Facebook Loginは、OAuth 2.0プロトコルに基づいた認証システムで、ウェブアプリやモバイルアプリに実装可能です。

### 実装フロー

1. **アプリ登録**: Facebook Developersでアプリを作成
2. **OAuth設定**: リダイレクトURIを設定
3. **JavaScript SDK読み込み**: Facebook SDKをページに追加
4. **ログインステータス確認**: `FB.getLoginStatus()`でログイン状態を確認
5. **ログイン実行**: `FB.login()`でログインダイアログを表示
6. **アクセストークン取得**: 認証成功後、アクセストークンを取得
7. **ユーザー情報取得**: Graph APIでユーザー情報を取得

### 取得可能なユーザー情報

#### 基本情報（public_profile）
- **id**: FacebookユーザーID（一意の識別子）
- **name**: 表示名
- **picture**: プロフィール画像URL

#### メールアドレス（email）
- **email**: メールアドレス

### 実装例

```javascript
// SDK初期化
FB.init({
  appId: '{your-facebook-app-id}',
  xfbml: true,
  version: '{api-version}'
});

// ログイン
FB.login(function(response) {
  if (response.authResponse) {
    // ユーザー情報取得
    FB.api('/me', {fields: 'id,name,email'}, function(response) {
      console.log('User ID: ' + response.id);
      console.log('Name: ' + response.name);
      console.log('Email: ' + response.email);
    });
  }
});
```

### ログインステータスのレスポンス

```json
{
  "status": "connected",
  "authResponse": {
    "accessToken": "{access-token}",
    "expiresIn": "{unix-timestamp}",
    "userID": "{user-id}"
  }
}
```

## ユーザー識別方法

### Facebook Login
- **userID**を使用してユーザーを一意に識別
- このIDは変更されない
- アプリごとに異なる値が発行される

### Instagram（一般ユーザー）
- ❌ **実装不可**: Instagram Basic Display APIが廃止されたため、一般ユーザーのInstagramログインは実装できない

## 実装可能性の結論

| 機能 | 実装可能性 | 備考 |
| :--- | :--- | :--- |
| **LINE Login** | ✅ 実装可能 | OAuth 2.0準拠、ユーザー識別可能 |
| **Facebook Login** | ✅ 実装可能 | OAuth 2.0準拠、ユーザー識別可能 |
| **Instagram Login（一般ユーザー）** | ❌ 実装不可 | 2024年12月4日にAPIが廃止 |
| **Instagram Login（ビジネス/クリエイター）** | △ 限定的に可能 | ビジネスアカウントのみ対象、一般ユーザーには不向き |

## 推奨事項

### キャバクラ面接アプリでの実装推奨

1. **LINE Login**: ✅ 強く推奨
   - 日本国内で高い普及率
   - 若い女性ユーザーの利用率が高い
   - 実装が容易

2. **Facebook Login**: ✅ 推奨
   - グローバルで広く利用されている
   - 実装が容易
   - Instagramアカウントと連携している場合もある

3. **Instagram Login**: ❌ 非推奨
   - 一般ユーザー向けのAPIが廃止
   - ビジネスアカウント限定では、ターゲットユーザー（若い女性）に適さない

### 代替案

Instagramでのログインを実現したい場合の代替案：
- **Facebook Loginを使用**: 多くのユーザーがInstagramとFacebookアカウントを連携しているため、Facebook Loginで代替可能
- **メールアドレス登録**: Instagramのユーザー名やプロフィールURLを任意で入力してもらう形式

## 参考URL

- [Instagram Basic Display APIに関する最新情報 | Meta for Developers](https://developers.facebook.com/blog/post/2024/09/04/update-on-instagram-basic-display-api/)
- [Instagramプラットフォーム | Meta for Developers](https://developers.facebook.com/docs/instagram-platform/)
- [ウェブ - Facebookログイン | Meta for Developers](https://developers.facebook.com/docs/facebook-login/web/)
