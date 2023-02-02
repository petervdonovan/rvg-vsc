'use strict'

import path from 'path';
import * as vscode from 'vscode';

import { doBuild } from './projectdata'
import { deserializeRange } from './serialization';

const tokenTypes = [
    'parameter', 'variable', 'number', 'function', 'label', 'string', 'number', 'macro'
];
const tokenModifiers = [
    'definition', 'defaultLibrary'
];
type tokenJson = {
    kind: string,
    modifier: string,
    range: number[][]
}
export const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);
export const semanticTokensProvider: vscode.DocumentSemanticTokensProvider = {
    provideDocumentSemanticTokens(document: vscode.TextDocument, _: vscode.CancellationToken) {
        const tokensBuilder: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend)
        for (const {file, output} of doBuild<tokenJson>(['tokens'], document)) {
            console.log("tokens provider sees token from file: " + file)
            if (path.resolve(file) == path.resolve(document.fileName)) {
                tokensBuilder.push(deserializeRange(output.range), output.kind, [])
            }
        }
        return tokensBuilder.build();
    }
}
