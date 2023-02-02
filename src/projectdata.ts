'use strict'

import path from 'path'
import * as vscode from 'vscode'
import { execSync } from 'child_process';

type ProjectConfig = {
    buildSequences: string[][]
}

let projectconfig: ProjectConfig = { buildSequences: [] }

async function updateProjectConfig() {
    console.log("updating project config")
    const buildFiles = await vscode.workspace.findFiles("**/rvgbuild")
    console.log("buildfiles=" + buildFiles)
    let buildSequences: string[][] = []
    for (const f of buildFiles) {
        const buildSequence = new TextDecoder().decode(await vscode.workspace.fs.readFile(f))
        buildSequences = buildSequences.concat(buildSequence.split("\n").map(it => it.split("->").map(it => path.resolve(path.dirname(f.fsPath), it.trim()))))
    }
    console.log("buildSequences=" + buildSequences)
    projectconfig = { buildSequences: buildSequences }
}

vscode.workspace.createFileSystemWatcher("**/rvgbuild").onDidChange(updateProjectConfig)
vscode.workspace.onDidOpenTextDocument(updateProjectConfig)

export const getProjectConfig: () => ProjectConfig = () => {
    return projectconfig
}

export const doBuild: <T>(args: string[], document: vscode.TextDocument) => T[] = <T>(args, document) => {
    const filesToBuild: string = getProjectConfig().buildSequences.find((it: string[]) => it.some(it => path.resolve(it) == path.resolve(document.fileName)))?.join(" ") || document.fileName
    console.log(`executing ${`rvg ${args.join(" ")} ${filesToBuild}`}`)
    const stdout = execSync(`rvg ${args.join(" ")} ${filesToBuild}`).toString().split('\n')
    const jsons: T[] = []
    let file: string = ""
    for (const line of stdout.filter(s => s.length > 0)) {
        console.log(line)
        try {
            jsons.push(JSON.parse(line))
        } catch (error) {
            console.error("JSON parse failed on " + line)
        }
    }
    return jsons
}
