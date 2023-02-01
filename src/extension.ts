'use strict'

import * as vscode from 'vscode'
import { legend, semanticTokensProvider } from './highlight'

export async function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(
        { language: 'rvg', scheme: 'file' },
        semanticTokensProvider,
        legend
    ));
}
