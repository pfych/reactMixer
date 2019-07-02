const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

export async function getApps () {
  return (await exec("pacmd list-sink-inputs")).stdout.match(/application.process.binary = "((?:\\.|[^"\\])*)"/g).map(app => {
    return app.split("= ")[1].replace(/"/g, "")
  })
}

export async function getOutputs () {
  return (await exec("pacmd list-sinks")).stdout.match(/name: <(.*)>/g).map(sink => {
    return sink.split(": ")[1].replace(/(<|>)/g, "")
  })
}

export async function getIndex (name) {
  console.log(name)
  return (await exec(`pacmd list-sink-inputs | grep -E '(index|application.process.binary)'`))
    .stdout.replace(/\n/g, " ").match(`index: [0-9]*[ \t]*application.process.binary = "${name}"`)[0].replace(`application.process.binary = "${name}"`, "").replace("index: ", "").replace(/\s/g, "")

}

export async function getOutIndex (name) {
  return (await exec(`pacmd list-sinks | tr '\\n' '\\r' | perl -pe 's/ *index: ([0-9]+).+?name: <([^\\r]+)>\\r.+?(?=index:|$)/\\2:\\1\\r/g' | tr '\\r' '\\n'`))
    .stdout.match(`${name}:.*`)[0].replace(`${name}:`, "")
}
