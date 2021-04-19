import logo from './logo.svg';
import './App.css';

import React, { Component } from "react";
import { API, graphqlOperation} from 'aws-amplify'

import { updateCeng2 } from './graphql/mutations'


var recognition = new window.webkitSpeechRecognition();
recognition.continuous = true;

class App extends Component {
  constructor(props) {
    super(props);

    localStorage.setItem("check",0)
    
    this.state = {
      content : null,
      button : "START",
      check : 0
    };


  }

  handleSubmit = async(e) => {
    e.preventDefault();
    console.log(this.state.content)

    if(this.state.check === 0){
      this.setState({check : 1})
      this.setState({button : "END"})
      this.Start();
    }else{
      this.setState({check : 0})
      this.setState({button : "START"})
      this.End();
    }

  };

  Start(){

    recognition.onresult = function(event) { 
      console.log(event);
      var output = document.getElementById("output");
      output.innerHTML = "";
      for(var i=0; i<event.results.length; i++){
          output.innerHTML = output.innerHTML + event.results[i][0].transcript;
      }
  }
  recognition.lang = "en-US";
  recognition.start();

  }

async End(){
    var output = document.getElementById("output");
    console.log(output)
    const content = output.textContent
    const data = {
      command : "command",
      content : content
    }
    
    try {
      await API.graphql(graphqlOperation(updateCeng2, {
          input: data
      }))
      console.log('item created!')
      } catch (err) {
      console.log('error creating talk...', err)
      }

    output.innerHTML = "";
    recognition.stop();

  }

  

  render() {

    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h2>Click the button and speak the command</h2>

          <div id = "output"></div>
          <form onSubmit={this.handleSubmit} noValidate>

            <div className="createAccount">
              <button type="submit" onChange={this.handleChange} >
                {this.state.button}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;