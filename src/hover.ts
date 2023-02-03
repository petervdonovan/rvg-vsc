'use strict'

import * as vscode from 'vscode'
import { doBuild } from './projectdata'
import { deserializeRange, SerializedRange } from './serialization'

type SerializedHover = {
    attrs: string[],
    typeUnionOf: string[],
    cycles: number | null,
    cyclesMod: string[],
    range: SerializedRange
}
let uniquify = <T>(a: T[]) => [...new Set(a)]
const provider: vscode.HoverProvider = {
    provideHover(document, position, _): vscode.Hover | undefined {
        const sHovers = doBuild<SerializedHover>(['hover', `${position.line}`, `${position.character}`, document.fileName], document)
        if (sHovers.length == 0) return;
        const hdup: SerializedHover = sHovers.reduce((previous, current, i, a) => { return {
            attrs: previous.attrs.concat(current.attrs),
            typeUnionOf: previous.typeUnionOf.concat(current.typeUnionOf),
            cycles: previous.cycles == current.cycles ? current.cycles : null,
            cyclesMod: previous.cyclesMod.concat(current.cyclesMod),
            range: previous.range
        }})
        const h = {
            attrs: uniquify(hdup.attrs),
            typeUnionOf: uniquify(hdup.typeUnionOf),
            cycles: hdup.cycles,
            cyclesMod: uniquify(hdup.cyclesMod),
            range: hdup.range
        }
        const markdown = new vscode.MarkdownString(`
*type:* ${h.typeUnionOf.filter(it => it.length > 0).join(" | ")}

${h.attrs.length == 0 ? "" : `*attrs:* ${h.attrs.join(" ")}` + "\n\n"}${
h.cycles == null ? "" : `*cycles:* ${h.cycles}` + "\n\n"
}${h.cyclesMod == null || h.cyclesMod.length == 0 ? "" : `*cyclesMod:* ${h.cyclesMod.concat(", ")}`
        }`)
        return new vscode.Hover(markdown, deserializeRange(sHovers[0].range).range)
    }
}

export default provider
