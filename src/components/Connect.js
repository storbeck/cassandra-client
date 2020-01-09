import React from "react"
import * as cassandra from "../service/cassandra"
import * as storage from "../service/storage"
import UIkit from 'uikit';

export default class Connect extends React.Component {
    state = {
        showPopupModal: false,
        connecting: false,
        contact_points: "",
        port: 9042,
        username: "",
        password: "",
        certificate: "",
        sslEnabled: false,
        statusText: "Not Connected",
    }

    connect() {

        storage.setConnection(this.state.contact_points, this.state.username, this.state.password, this.state.port, this.state.sslEnabled, this.state.certificate)

        this.setState({connecting: true, statusText: "Connecting..."})
        
        cassandra.connect(this.state.contact_points, this.state.username, this.state.password, this.state.port, this.state.sslEnabled, this.state.certificate)
            .then(() => {
                this.props.connected()

                this.setState({
                    statusText: "Connected",
                    connecting: false,
                }, () => {
                    UIkit.modal("#connect-modal").hide();
                })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    statusText: err.message,
                    connecting: false
                })
            })

    }

    disconnect() {
        cassandra.disconnect()
            .then(() => {
                this.props.disconnect()
                this.setState({
                    statusText: "Not Connected",
                    connecting: false
                })
            })
            .catch(err => {
                console.error(err)
            })
    }

    componentDidMount() {
        storage.getConnection()
        .then(conn => {
            this.setState({
                contact_points: conn.contact_points,
                username: conn.username,
                password: conn.password,
                port: conn.port,
                sslEnabled: conn.sslEnabled,
                certificate: conn.certificate,
                showPopupModal: true
            })
        })
        .catch(err => console.err(err))
    }

    render() {
        return (
            <div>
                {this.state.statusText === "Connected" 
                    ? <button style={{marginRight: 20}} className="uk-button uk-button-danger " onClick={this.disconnect.bind(this)}>Disconnect</button>
                    : <button style={{marginRight: 20}} className="uk-button uk-button-primary " data-uk-toggle="target: #connect-modal">Connect</button> }

                <div id="connect-modal" data-uk-modal>
                    <div className="uk-modal-dialog">
                        <button className="uk-modal-close-default" type="button" data-uk-close></button>
                        <div className="uk-modal-body">
                            <form>
                            <div className="uk-form-stacked">
                            <div className="uk-margin">
                                <label className="uk-form-label" htmlFor="contact_points">Contact Points</label>
                                <input
                                    className="uk-input"
                                    id="contact_points"
                                    value={this.state.contact_points || ''}
                                    onChange={(e) => this.setState({contact_points: e.target.value})}
                                    placeholder="127.0.0.1"
                                />
                            </div>
                            <div className="uk-margin">
                                <label className="uk-form-label" htmlFor="port">Port</label>
                                <input
                                    className="uk-input"
                                    id="port"
                                    value={this.state.port || ''}
                                    onChange={(e) => this.setState({port: e.target.value})}
                                    placeholder="9042"
                                />
                            </div>
                            <div className="uk-margin">
                                <label className="uk-form-label" htmlFor="username">Username</label>
                                <input
                                    className="uk-input"
                                    id="username"
                                    value={this.state.username || ''}
                                    onChange={(e) => this.setState({username: e.target.value})}
                                    placeholder=""
                                />
                            </div>
                            <div className="uk-margin">
                                <label className="uk-form-label" htmlFor="password">Password</label>
                                <input
                                    className="uk-input"
                                    id="password"
                                    type="password"
                                    value={this.state.password || ''}
                                    onChange={(e) => this.setState({password: e.target.value})}
                                    placeholder=""
                                />
                            </div>
                            <div className="uk-margin">
                                <label><input 
                                    className="uk-checkbox" 
                                    type="checkbox" 
                                    checked={this.state.sslEnabled} 
                                    onChange={() => this.setState({sslEnabled: !this.state.sslEnabled})} /> Enable SSL</label>
                            </div>
                            {this.state.sslEnabled ? 
                                <div className="uk-margin">
                                    <div data-uk-form-custom="target: true">
                                        <input type="file" 
                                            onChange={(val) => {
                                                if (val.target.files.length > 0) {
                                                    this.setState({certificate: val.target.files[0].path})
                                                }
                                        }} />
                                        <input 
                                            className="uk-input uk-form-width-medium" 
                                            type="text" 
                                            value={this.state.certificate || ""}
                                            onChange={(val) => console.log(val)}
                                            placeholder={this.state.certificate || "Select certificate"}
                                            disabled />
                                    </div>
                                </div> : null }
                            <p>{this.state.statusText}</p>
                        </div>
                            </form>
                        </div>
                        <div className="uk-modal-footer">
                            <button className="uk-button uk-button-primary" type="button" onClick={this.connect.bind(this)}>Connect</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}