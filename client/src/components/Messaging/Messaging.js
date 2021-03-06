import React, { Component } from 'react';
import { connect } from "react-redux";
import { Comment, Container, Form, Button, Segment } from 'semantic-ui-react';
import API from '../../utils/API';
import io from "socket.io-client";
// import loadingGif from '../img/loader.gif';

const socketUrl = "localhost:3001";

const style = {
    mainDivStyle: {
        marginTop: "100px",
        marginBottom: "40px"
    }
}

const userStyling = {
    "position": "relative",
    "background": "#e8e8e8",
    "borderRadius": ".4em",
    "padding": "12px"
}
const userStylingAfter = {
    "content": "''",
    "position": "absolute",
    "right": "0",
    "top": "50%",
    "width": "0",
    "height": "0",
    "border": "25px solid transparent",
    "borderLeftColor": "#e8e8e8",
    "borderRight": "0",
    "borderBottom": "0",
    "marginTop": "-12.5px",
    "marginRight": "-25px"
}

const partnerStyling = {
    "position": "relative",
    "background": "#63e4e8",
    "borderRadius": ".4em",
    "padding": "12px"
}
const partnerStylingAfter ={
      "content": "''",
      "position": "absolute",
      "left": "0",
      "top": "50%",
      "width": "0",
      "height": "0",
      "border": "25px solid transparent",
      "borderRightColor": "#63e4e8",
      "borderLeft": "0",
      "borderBottom": "0",
      "marginTop": "-12.5px",
      "marginLeft": "-25px"
}
let mapStateToProps = (store) => {
    return {
        user: store.user
    }
  }

class Messaging extends Component {
    constructor() {
        super()
        this.state = {
            messages: [],
            content: "",
            socket: null
        };
    }
    componentDidMount() {
        this.loadMessages();
        this.initSocket();
    }
    loadMessages() {
        API.getMessages(this.props.cid)
        .then(res =>{
          this.setState({messages:res.data.messages})
        })
        .catch(err => console.log(err));
    }
    initSocket = () =>{
        const socket = io(socketUrl);
        socket.on('connect', () => {
            console.log('connected');
        })
        this.setState({socket});
    }
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    }
    handleFormSubmit = (event)=>{
        event.preventDefault();
        if(this.state.content !== ""){
            API.newMessage({
                conversation: this.props.cid,
                content: this.state.content
            }).then(res => {
                this.state.socket.emit('update messages');
                this.state.socket.on('update messages', () =>{
                    this.loadMessages();
                })
                this.setState({content: ""})
            }).catch(err => console.log(err));
        }
      }
    render(){
        if (this.state.messages.length === 0) {
            return (
                <Container>
                    {/* <Image src = {loadingGif} style = {{"height": "50px", "width": "50px"}} /> */}
                    <div className="ui active inverted dimmer">
                        <div className="ui large text loader" style={{marginTop: "-10%"}}>Loading</div>
                    </div>
                </Container>
            )
        }
        return(
            <Container style={style.mainDivStyle}> 

                <Comment.Group>
                    <Segment.Group>
                        <Segment>
                        <Form reply>
                            <Form.TextArea                       
                            style={{ "minHeight": "50", "height": "10em" }}
                            value={this.state.content}
                            onChange={this.handleInputChange}
                            name="content"
                            placeholder="Send"
                            />
                            <Button color='black' content='Send Message' onClick={this.handleFormSubmit} />
                        </Form>
                        </Segment>
                    </Segment.Group>
                    
                {this.state.messages.map(message =>{
                    return(
                        <Comment key = {message._id} 
                         style={(message.sender._id === this.props.user._id) ? userStyling: partnerStyling}>
                        <div style = {(message.sender._id === this.props.user._id) ? userStylingAfter: partnerStylingAfter}/>
                            <Comment.Content>
                                <Comment.Author>{message.sender.name.givenName}
                                    <Comment.Metadata><div>{message.date}</div></Comment.Metadata>
                                </Comment.Author>
                                <Comment.Text>{message.content}</Comment.Text> 
                            </Comment.Content>
                        </Comment>
                    )
                })}
                    
                </Comment.Group>
            </Container>
        )
        
    }
}

export default connect(mapStateToProps)(Messaging);