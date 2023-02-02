'use strict'

import * as vscode from 'vscode'

export type DeserializedRange = {
    file: vscode.Uri,
    range: vscode.Range
}

export type SerializedRange = {
    file: string,
    range: number[][]
}

export const deserializeRange: (r: SerializedRange) => DeserializedRange = r => ({
    file: vscode.Uri.parse(r.file),
    range: new vscode.Range(
        new vscode.Position(r.range[0][0], r.range[0][1]),
        new vscode.Position(r.range[1][0], r.range[1][1])
    )})
