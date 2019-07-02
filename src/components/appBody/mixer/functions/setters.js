const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

export let existing = []

export async function newOutput (name, input, output, outputID) {
  let sinkID = (await exec(`pactl load-module module-null-sink sink_name="${name}" sink_properties=device.description="${name}"`)).stdout.replace("\n", "")
  let moduleID = (await exec(`pactl load-module module-loopback source="${name}.monitor" sink=${output} rate=44100`)).stdout.replace("\n", "")
  await exec(`pacmd move-sink-input ${input} ${sinkID}`)
  console.log(`
    Created Null sink ${sinkID}:${name}
    Forwarded ${name} sink to ${output} with loopback Module ${moduleID}
    Moved sink input ${input} to ${outputID}
    
    Unload with:
    pactl unload-module ${sinkID} && pactl unload-module ${moduleID}
  `)
  existing.push({
    name: name,
    sinkID: sinkID,
    moduleID: moduleID
  })
}