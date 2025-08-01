import * as vscode from "vscode";

import {
  makeEvent,
  onDidChangeTextDocument,
  onWillSaveTextDocument,
  TraceEvent,
} from "./traces";

import ConfigManager from "./configs";
import { resendCaches } from "./traces/resend";
import { setJwtTokens } from "./token";

function makeDebounce<T>(
  fn: (arg: T) => TraceEvent,
  delay: number = 5000
): (arg: T) => void {
  let timer: NodeJS.Timeout;
  return function (arg: T) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      makeEvent(arg, fn);
    }, delay);
  };
}

export function activate(context: vscode.ExtensionContext) {
  const configManager = ConfigManager.getInstance();
  setJwtTokens(configManager?.getConfigs()?.token ?? "");
  const debounceSaved = makeDebounce(onWillSaveTextDocument);
  const debounceChange = makeDebounce(onDidChangeTextDocument);

  context.subscriptions.push(
    vscode.commands.registerCommand("codeRecorder.hello", () => {
      vscode.window.showInformationMessage("Hello There!");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codeRecorder.sendCache", resendCaches)
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      debounceSaved(document);
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((document) => {
      debounceChange(document);
    })
  );
}

export function deactivate() {}
