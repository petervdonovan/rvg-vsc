'use strict'

import * as vscode from 'vscode'

export const deserializeRange = (r: number[][]) => new vscode.Range(new vscode.Position(r[0][0], r[0][1]), new vscode.Position(r[1][0], r[1][1]))
