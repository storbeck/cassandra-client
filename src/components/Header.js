import React from "react"
import Connect from "./Connect"

export default class Header extends React.Component {
    render() {
        return (
            <nav className="uk-navbar-container" data-uk-navbar>
                <div className="uk-navbar-left">
                    <a className="uk-navbar-item uk-logo" href="#">Cassandra Client</a>
                </div>

                <div className="uk-navbar-right">
                    <Connect connected={() => this.props.connected()} disconnect={() => this.props.disconnect()} />
                </div>
            </nav>
        )
    }
}