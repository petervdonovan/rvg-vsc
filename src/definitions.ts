'use strict'

import * as vscode from 'vscode'
import { doBuild } from './projectdata'
import { deserializeRange } from './serialization'

type definition = {
    range: number[][]
}

const provider: vscode.DefinitionProvider = {
    provideDefinition(document, position, _) {
        return doBuild<definition>(['definition', `${position.line}`, `${position.character}`], document).map(d => new vscode.Location(vscode.Uri.parse(d.file), deserializeRange(d.output.range)))
    }
}

export default provider
