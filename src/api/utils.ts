import * as vscode from "vscode";

import API from ".";

export function welcomeMessage(catchFn: () => void = () => {}) {
  API.getInstance()
    .get("user/info/")
    .then(({ data: userInfo }) => {
      vscode.window.showInformationMessage(
        `Welcome Dear ${userInfo.name} 👋 `
      );
    })
    .catch(catchFn);
}
