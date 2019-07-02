// THIS IS ALL SPAGHETTI, I AM JUST GETTING IT WORKING BEFORE I SPLIT IT INTO NICER FRAGMENTS AND FUNCTIONS
// I APOLOGISE TO ANYONE WHO IS READING THIS IN ADVANCE

import React, { Component } from 'react';
import { getApps, getOutputs } from './functions/getters'
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

class Mixer extends Component {
  constructor (props) {
    super(props)
    this.newOutput = this.newOutput.bind(this)
    this.removeOutput = this.removeOutput.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleOutputChange = this.handleOutputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      volume: 100,
      name: "Name Channel",
      apps: ["Unable to fetch apps"],
      outputs: ["Unable to fetch outputs"],
      existing: []
    }
  }

  async newOutput (name, input, output) {
    let sinkID = (await exec(`pactl load-module module-null-sink sink_name="${name}" sink_properties=device.description="${name}"`)).stdout.replace("\n", "")
    let moduleID = (await exec(`pactl load-module module-loopback source="${name}.monitor" sink=${output} rate=44100`)).stdout.replace("\n", "")


    // Need to move sink output here but inputID changes when a module is created so I causes the audio forwarding to be incorrect
    // await exec(`pacmd move-sink-input ${getIndex(input)} sinkID`) // Get error because getIndex() returns apps old sink ID

    let newState = this.state.existing.concat({ name: name, sinkID: sinkID, moduleID: moduleID })
    this.setState({existing: newState})
  }

  async componentDidMount () {
    let apps = await getApps()
    let outputs = await getOutputs()
    this.setState({
      apps: apps,
      outputs: outputs,
      input: apps[0],
      output: outputs[0],
    })
  }

  async removeOutput (input, output) {
    await exec(`pactl unload-module ${input} && pactl unload-module ${output}`)
    let exist = this.state.existing.filter( value => {
      return value.sinkID !== input
    })
    this.setState({existing: exist})
  }

  handleNameChange (e) {
    this.setState({
      name: e.target.value,
    })
  }

  handleInputChange (e) {
    this.setState({
      input: e.target.value,
    })
  }

  handleOutputChange (e) {
    this.setState({
      output: e.target.value,
    })
  }

  async handleSubmit (e) {
    e.preventDefault();
    await this.newOutput(this.state.name, this.state.input, this.state.output)
  }

  render () {
    return (
      <div className="Mixer">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input placeholder="Channel Name" className="form-control Top" onChange={this.handleNameChange} value={this.state.text} type="text"/>
            <select className="form-control Middle" onChange={this.handleInputChange} value={this.state.text} name="application">
              {this.state.apps.map(app => <option value={app}>{app}</option>)}
            </select>
            <select className="form-control Middle" onChange={this.handleOutputChange} value={this.state.text} name="outputs">
              {this.state.outputs.map(output => <option value={output}>{output}</option>)}
            </select>
            <button className="form-control Bottom">Create Channel</button>
          </div>
        </form>
        {this.state.existing.map(existing => <div><div className="card Top"><div className="Title">{existing.name}</div></div><button className="btn btn-light Bottom BoButton" onClick={() => this.removeOutput(existing.sinkID, existing.moduleID)}>Delete</button><br/></div>)}
      </div>
    )
  }
}



export default Mixer;