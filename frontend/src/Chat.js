import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const URL = 'ws://localhost:3030'

class Chat extends Component {
  state = {
    name: 'Editor',
    documentStruct: null
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const dataStruct = JSON.parse(evt.data)
      this.setState(state => ({documentStruct: dataStruct}))
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }
 
  editLineNumer = (lineNum, value) => {
    // change the local document
  }
  
  submitChange =( lineNumber, newValue) => {
    this.ws.send(JSON.stringify({
        current_document_version: this.state.documentStruct.version,
        name: this.state.name,
        line_number: lineNumber,
        new_value: newValue
    })) 
  }

  submitMessage = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { name: this.state.name, message: messageString }
    this.ws.send(JSON.stringify(message))
    this.addMessage(message)
  
  }

  hasDocumentStruc = () => {
    return this.state.documentStruct != null;
  }

  render() {
    return (
      <div>
        <label htmlFor="name">
          Editor Name:&nbsp;
          <input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.name}
           onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        <ChatInput
          ws={this.ws}
          //onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        
        { this.hasDocumentStruc() ? this.state.documentStruct.document.map((value, index) =>
           <ChatMessage
            key={index}
            lineNumber={index}
            value={value}
            editor={this.state.name}
            onChangeFunc={e => { 
              console.log(index);
              console.log(e.target.value);
              this.submitChange(index, e.target.value);
              }
            }
          />
        )
        :  <strong> No Document Loaded</strong> 
        }
      </div>
    )
  }
}

export default Chat
