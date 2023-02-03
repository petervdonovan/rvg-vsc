'use strict'

import * as vscode from 'vscode'
import definitions from './definitions';
import hover from './hover'
import { legend, semanticTokensProvider } from './highlight'

export async function activate(context: vscode.ExtensionContext) {
    const selector = { language: 'rvg', scheme: 'file' }
    vscode.languages.registerDocumentSemanticTokensProvider(selector, semanticTokensProvider, legend);
    vscode.languages.registerDefinitionProvider(selector, definitions)
    vscode.languages.registerHoverProvider(selector, hover)
}
