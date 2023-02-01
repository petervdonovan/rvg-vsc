'use strict'

import { execSync } from 'child_process';
import {
    TextDocument,
    DocumentSemanticTokensProvider,
    ProviderResult,
    SemanticTokens,
    SemanticTokensBuilder,
    SemanticTokensLegend,
    Range,
    Position,
    CancellationToken,
    window
} from 'vscode';

const tokenTypes = [
    'parameter', 'variable', 'number', 'function', 'label'
];
const tokenModifiers = [
    'definition', 'defaultLibrary'
];
type tokenJson = {
    kind: string,
    modifier: string,
    startInclusive: number[],
    endExclusive: number[]
}
export const legend = new SemanticTokensLegend(tokenTypes, tokenModifiers);
export const semanticTokensProvider: DocumentSemanticTokensProvider = {
    provideDocumentSemanticTokens(document: TextDocument, _: CancellationToken) {
        const tokensBuilder: SemanticTokensBuilder = new SemanticTokensBuilder(legend);
        const stdout: string[] = execSync(`rvg tokens ${document.fileName}`).toString().split("\n")
        for (const line of stdout.filter(s => s.length > 0)) {
            const token: tokenJson = JSON.parse(line)
            tokensBuilder.push(new Range(new Position(token.startInclusive[0], token.startInclusive[1]), new Position(token.endExclusive[0], token.endExclusive[1])), token.kind, [])
        }
        return tokensBuilder.build();
    }
}
