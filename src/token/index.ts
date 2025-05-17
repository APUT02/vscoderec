import * as vscode from "vscode";

interface JwtTokens {
	codeTraceToken: string;
}

export function getJwtTokens(): JwtTokens {
	const config = vscode.workspace.getConfiguration("codeRecorder");
	return config.get<JwtTokens>("jwtTokens") || { codeTraceToken: "" };
}

export function setJwtTokens(codeTraceToken: string): void {
	const config = vscode.workspace.getConfiguration("codeRecorder");
	config.update(
		"jwtTokens",
		codeTraceToken,
		vscode.ConfigurationTarget.Global
	);
}
