'use strict'

import * as vscode from 'vscode'

export const semanticTokensProvider: vscode.HoverProvider = {
    provideHover(document: vscode.TextDocument, position: vscode.Position, _: vscode.CancellationToken) {
        return new vscode.Hover('Test')
    }
}
