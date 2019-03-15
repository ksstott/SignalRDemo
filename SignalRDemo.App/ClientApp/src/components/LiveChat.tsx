import React, { Component } from "react";
import { NewMessageForm } from "./NewMessageForm";
import { MoveableBox } from "./MoveableBox";
import { HubConnectionBuilder } from "@aspnet/signalr";

interface LiveChatState {
    messages: string[];
    position: { x: number, y: number };
}

export class LiveChat extends Component<{}, LiveChatState> {

    private connection = new HubConnectionBuilder().withUrl("/chat").build();

    public async componentDidMount() {
        try {
            await this.connection.start();
            this.connection.on("messageReceived", this.addMessage);
            this.connection.on("moveReceived", this.onMoved);
        } catch (e) {
            console.error(e);
        }
    }

    public componentWillUnmount() {
        this.connection.stop();
    }

    public state: LiveChatState = {
        messages: [],
        position: { x: 0, y: 0 }
    }

    public render() {
        const { messages } = this.state;
        return (
            <div>
                <h2>Live chat</h2>
                {JSON.stringify(this.state.position)}
                <ul>
                    {messages.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
                <NewMessageForm sendMessage={this.sendMessage} />
                <MoveableBox position={this.state.position} onMove={this.onMove} />
            </div>
        );
    }

    private addMessage = (message: string) => this.setState(state => ({
        messages: [...state.messages, message]
    }));

    private onMove = async (position: { x: number, y: number }) => {
        await this.connection.send("sendMove", position.x, position.y);
        this.onMoved(position.x, position.y);
    }

    private onMoved = (x: number, y: number) => this.setState({
        position: { x, y }
    });

    private sendMessage = async (message: string) => {
        await this.connection.send("sendMessage", message);
        this.addMessage(message);
    }
}
