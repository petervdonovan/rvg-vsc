'use strict'

import path from 'path';
import * as vscode from 'vscode';

import { doBuild } from './projectdata'
import { DeserializedRange, deserializeRange, SerializedRange } from './serialization';

const tokenTypes = [
    'parameter', 'variable', 'number', 'function', 'label', 'string', 'number', 'macro'
];
const tokenModifiers = [
    'definition', 'defaultLibrary'
];
type tokenJson = {
    kind: string,
    modifier: string,
    range: SerializedRange
}
export const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);
export const semanticTokensProvider: vscode.DocumentSemanticTokensProvider = {
    provideDocumentSemanticTokens(document: vscode.TextDocument, _: vscode.CancellationToken) {
        const tokensBuilder: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend)
        for (const token of doBuild<tokenJson>(['tokens'], document)) {
            if (token.range.file == document.uri.fsPath) {
                let r = deserializeRange(token.range)
                tokensBuilder.push(r.range, token.kind, [])
            }
        }
        return tokensBuilder.build();
    }
}
