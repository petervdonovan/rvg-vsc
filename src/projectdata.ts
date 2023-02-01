'use strict'

import * as vscode from 'vscode'

type ProjectConfig = {
    buildSequence: string[]
}

let projectconfig: ProjectConfig | null = null

const updateProjectConfig = async () => {
    const buildFiles = await vscode.workspace.findFiles("rvgbuild")
    if (buildFiles && buildFiles.length > 0) {
        const buildSequence = new TextDecoder().decode(await vscode.workspace.fs.readFile(buildFiles[0]))
        projectconfig = { buildSequence: buildSequence.split("->") }
    }
    projectconfig = null
}

vscode.workspace.createFileSystemWatcher("rvgbuild").onDidChange(updateProjectConfig)

export const getProjectConfig: () => ProjectConfig | null = () => {
    return projectconfig
}
