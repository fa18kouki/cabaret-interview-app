/**
 * クラス名を結合するユーティリティ関数
 * 複数のクラス名を受け取り、falsy値を除外して結合します
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}
