import React from "react"
import * as cassandra from "../service/cassandra"
import KeyspaceItem from "./KeyspaceItem"

export default class Sidebar extends React.Component {
    state = {
        keyspaces: []
    }

    loadData() {
        cassandra.getKeyspaces()
            .then(res => this.setState({keyspaces: res.rows}))
            .catch(err => console.error(err))
    }

    render() {
        const compare = ((a,b) => (a.keyspace_name > b.keyspace_name) ? 1 : -1)
        const keyspace_items = this.state.keyspaces
            .sort(compare)
            .map((k, id) => <KeyspaceItem key={id} keyspace={k.keyspace_name} />)

        return (
            <div style={{float: "left", paddingLeft: 20, minWidth: 200, marginRight: 20}} className="uk-nav uk-nav-default">
                <ul className="uk-nav-default uk-nav-parent-icon" data-uk-nav>
                    { keyspace_items }
                </ul>
            </div>
        )
    }
}