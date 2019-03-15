import React, { Component } from "react";
import { NewMessageForm } from "./NewMessageForm";
import { HubConnectionBuilder } from "@aspnet/signalr";

interface LiveChatState {
    messages: string[];
}

export class LiveChat extends Component<{}, LiveChatState> {

    private connection = new HubConnectionBuilder().withUrl("/chat").build();

    public async componentDidMount() {
        try {
            await this.connection.start();
            this.connection.on("messageReceived", this.addMessage);
        } catch (e) {
            console.error(e);
        }
    }

    public componentWillUnmount() {
        this.connection.stop();
    }

    public state: LiveChatState = {
        messages: []
    }

    public render() {
        const { messages } = this.state;
        return (
            <div>
                <h2>Live chat</h2>
                <ul>
                    {messages.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
                <NewMessageForm sendMessage={this.sendMessage} />
            </div>
        );
    }

    private addMessage = (message: string) => this.setState(state => ({
        messages: [...state.messages, message]
    }));

    private sendMessage = async (message: string) => {
        await this.connection.send("sendMessage", message);
        this.addMessage(message);
    }
}
