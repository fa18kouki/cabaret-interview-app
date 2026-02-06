// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  DiagnosisChat,
  type ChatMessage,
  type ChatOption,
} from "@/components/diagnosis/DiagnosisChat";

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

function createAiMessage(
  id: string,
  content: string,
  options?: ChatOption[]
): ChatMessage {
  return {
    id,
    type: "ai",
    content,
    options,
    timestamp: new Date(),
  };
}

function createUserMessage(id: string, content: string): ChatMessage {
  return {
    id,
    type: "user",
    content,
    timestamp: new Date(),
  };
}

describe("DiagnosisChat", () => {
  it("初期状態で選択肢ボタンがクリック可能", () => {
    const options: ChatOption[] = [
      { id: "opt1", label: "選択肢1", value: "val1" },
      { id: "opt2", label: "選択肢2", value: "val2" },
    ];
    const messages: ChatMessage[] = [
      createAiMessage("msg1", "質問です", options),
    ];
    const onSelect = vi.fn();

    render(
      <DiagnosisChat messages={messages} onSelectOption={onSelect} />
    );

    const btn1 = screen.getByText("選択肢1");
    const btn2 = screen.getByText("選択肢2");

    expect(btn1).not.toBeDisabled();
    expect(btn2).not.toBeDisabled();
  });

  it("選択後、同じメッセージ内の他ボタンがdisabledになる", () => {
    const options: ChatOption[] = [
      { id: "opt1", label: "選択肢1", value: "val1" },
      { id: "opt2", label: "選択肢2", value: "val2" },
    ];
    const messages: ChatMessage[] = [
      createAiMessage("msg1", "質問です", options),
    ];
    const onSelect = vi.fn();

    render(
      <DiagnosisChat messages={messages} onSelectOption={onSelect} />
    );

    fireEvent.click(screen.getByText("選択肢1"));

    expect(onSelect).toHaveBeenCalledWith(options[0]);
    expect(screen.getByText("選択肢2")).toBeDisabled();
  });

  it("新メッセージ追加後、新しいボタンがクリック可能になる", () => {
    const options1: ChatOption[] = [
      { id: "start", label: "開始", value: "start" },
    ];
    const options2: ChatOption[] = [
      { id: "a", label: "回答A", value: "a" },
      { id: "b", label: "回答B", value: "b" },
    ];
    const onSelect = vi.fn();

    // 最初のメッセージを表示
    const initialMessages: ChatMessage[] = [
      createAiMessage("msg1", "最初の質問", options1),
    ];
    const { rerender } = render(
      <DiagnosisChat messages={initialMessages} onSelectOption={onSelect} />
    );

    // 「開始」をクリック
    fireEvent.click(screen.getByText("開始"));
    expect(onSelect).toHaveBeenCalledTimes(1);

    // 新しいメッセージが追加される
    const updatedMessages: ChatMessage[] = [
      createAiMessage("msg1", "最初の質問", options1),
      createUserMessage("user1", "開始"),
      createAiMessage("msg2", "次の質問", options2),
    ];
    rerender(
      <DiagnosisChat messages={updatedMessages} onSelectOption={onSelect} />
    );

    // 新しいボタンがクリック可能
    const btnA = screen.getByText("回答A");
    const btnB = screen.getByText("回答B");
    expect(btnA).not.toBeDisabled();
    expect(btnB).not.toBeDisabled();

    // クリックできることを確認
    fireEvent.click(btnA);
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith(options2[0]);
  });

  it("過去メッセージの選択肢ボタンは表示されない", () => {
    const options1: ChatOption[] = [
      { id: "start", label: "開始ボタン", value: "start" },
    ];
    const options2: ChatOption[] = [
      { id: "a", label: "新しい回答", value: "a" },
    ];
    const onSelect = vi.fn();

    // 過去メッセージ + ユーザー応答 + 最新メッセージ
    const messages: ChatMessage[] = [
      createAiMessage("msg1", "最初の質問", options1),
      createUserMessage("user1", "開始"),
      createAiMessage("msg2", "次の質問", options2),
    ];
    render(
      <DiagnosisChat messages={messages} onSelectOption={onSelect} />
    );

    // 最新メッセージの選択肢のみ操作可能
    expect(screen.getByText("新しい回答")).not.toBeDisabled();

    // 過去メッセージの選択肢はdisabledまたは非表示
    // （実装により、過去メッセージの選択肢はdisabledになるか、表示されない）
    const oldButton = screen.queryByText("開始ボタン");
    if (oldButton) {
      expect(oldButton).toBeDisabled();
    }
  });
});
