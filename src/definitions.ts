'use strict'

import * as vscode from 'vscode'
import { doBuild } from './projectdata'
import { deserializeRange, SerializedRange } from './serialization'

type definition = {
    range: SerializedRange
}

const provider: vscode.DefinitionProvider = {
    provideDefinition(document, position, _) {
        return doBuild<definition>(['definition', `${position.line}`, `${position.character}`, document.fileName], document).map(d => new vscode.Location(vscode.Uri.parse(d.range.file), deserializeRange(d.range).range))
    }
}

export default provider
