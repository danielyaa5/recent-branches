import {spawnSync, execSync} from 'child_process'
import cliSelect from 'cli-select'
import chalk from 'chalk';

const recent_branches_cmd = `
git reflog | grep -o "checkout: moving from .* to " | sed -e 's/checkout: moving from //' -e 's/ to $//' | head -40
`

const runCmd = (cmd) => {
    const result = spawnSync(cmd, [], {shell: true, encoding: 'utf8'})

    if (result.stderr) {
        console.error(result.stderr)
        process.exit(1)
    }

    if (result.status !== 0) {
        throw Error(`Command FAILED with status ${result.status}, no stderr: ${cmd}`)
    }

    return result.stdout
}

const run = async () => {
    const branches_cmd_output = runCmd(recent_branches_cmd, {shell: true, encoding: 'utf8'})

    const branches = [...new Set(
        branches_cmd_output.split('\n').filter(branch => branch.trim() !== '')
    )]
    const selected = await cliSelect({
        selected: '',
        unselected: '',
        values: branches,
        valueRenderer: (value, selected) => selected ? chalk.inverse(value) : value
    })
    try {
        execSync(`git checkout ${selected.value}`, {stdio: 'inherit'})
    } catch(e) {
        
    }
}

export { run }
