import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Container, Row, Col, Spinner, Card, Button } from 'react-bootstrap';

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      name: '',
      message: '',
      messages: [],
      scrolled: false,
      height: 0,
      disabled: true,
      disabledName: false,
      disabledButtonName: true,
      disabledButtonMessage: true,
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('FromServerInit', data => this.setState({ response: data }));
    socket.on(
      'chat message',
      data => {
        let messages = this.state.messages;
        messages.push(data);
        this.setState({ messages: messages, scrolled: false })
      }
    );

    setInterval(() => {
      if(this.state.messages.length !== 0){
        if(document.getElementById(this.state.messages[this.state.messages.length - 1].id) && this.state.scrolled === false){          
          var element = document.getElementById(this.state.messages[this.state.messages.length - 1].id);
          var messages = document.getElementById('messages');
          var height = this.state.height + element.scrollHeight;
          this.setState({ scrolled: true, height: height });
          messages.scrollTop = this.state.height;
        }
      }
    }, 400);
  }

  handleChange = event => {
    this.setState({
      name: event.target.value,
      disabledButtonName: false
    });
  }

  handleKeyPress = event => {
    if(event.key === 'Enter'){
      this.setState({
        disabledButtonName: true,
        disabled: false,
        disabledName: true
      });
    }
  }

  handleKeyPressMessage = event => {
    if(event.key === 'Enter'){
      const { endpoint } = this.state;
      const socket = socketIOClient(endpoint);
      this.setState({ 
        message: ''
      });

      socket.emit(
        'chat message',
        {
          'id' : new Date().getUTCMilliseconds(),
          'message' : this.state.message,
          'messenger' : this.state.name
        }  
      );
    }
  }

  handleChangeMessage = event => {
    this.setState({
      message: event.target.value,
      disabledButtonMessage: false
    });
  }

  handleClickNameButton = event => {
    this.setState({ 
      disabledButtonName: true,
      disabled: false,
      disabledName: true
    });
  }

  handleClickMessageButton = event => {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    this.setState({ 
      message: ''
    });

    socket.emit(
      'chat message',
      {
        'id' : new Date().getUTCMilliseconds(),
        'message' : this.state.message,
        'messenger' : this.state.name
      }  
    );

  }

  render() {
    const { response } = this.state;
    return (
        <Container style={{ marginTop: '15px' }}>
          <Row className="justify-content-md-center">
            <Col lg={4} m={4} s={6}>
              <input type="text" value={this.state.name} placeholder="Nombre" onChange={this.handleChange} onKeyPress={this.handleKeyPress} disabled={this.state.disabledName}/>
              <button disabled={this.state.disabledButtonName} onClick={this.handleClickNameButton}>
                Guardar
              </button>
          {response
              ? 
              <div>
                <div>
                <Button variant="success" size="sm" disabled>                  
                  {response}
                </Button>
              </div>
                <div id="messages" style={{ overflowY: 'scroll', maxHeight: 'calc(100vh - 130px)', minHeight: 'calc(100vh - 130px)' }}>
                  {
                    this.state.messages.map(( (message) => {
                      return (
                        <div id={ message.id } key={ message.id }>                          
                          {
                            message.messenger === this.state.name ? 
                              <Card body className="sender" style={{ textAlign: 'right', marginTop: '3px' }}>
                                <span style={{ fontSize: '12px' }}> { message.messenger } </span>
                                <p>{ message.message }</p>
                              </Card>  
                              :
                              <Card body className="receiver" style={{ textAlign: 'left', marginTop: '3px' }}>    
                                <span style={{ fontSize: '12px' }}> { message.messenger } </span>
                                <p>{ message.message }</p>
                              </Card>                       
                          }
                        </div>
                      )                    
                    }))
                  }
                </div>
                <input type="text" value={this.state.message} placeholder="Message" onChange={this.handleChangeMessage} onKeyPress={this.handleKeyPressMessage} disabled={this.state.disabled} style={{ bottom: 0 }}/>
                <button disabled={this.state.disabledButtonMessage} onClick={ this.handleClickMessageButton}>
                  Enviar
                </button>
              </div>
              :
              <div>
                <Button variant="primary" size="sm" disabled>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Cargando...
                </Button>
              </div>
            }
            </Col>
          </Row>
        </Container>
    );
  }
}
export default App;