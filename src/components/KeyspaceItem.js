import React from "react"
import TableItem from "./TableItem"
import * as cassandra from "../service/cassandra"

export default class KeyspaceItem extends React.Component {

    state = { 
        tables: [], 
        views: [] 
    }

    getInfo() {
        Promise.all([cassandra.getTables(this.props.keyspace), cassandra.getViews(this.props.keyspace)])
            .then(([res1, res2]) => {
                this.setState({
                    tables: res1.rows,
                    views: res2.rows
                })
            })
            .catch(err => console.error(err))
    }
    
    render() {
        const {keyspace} = this.props;
        const tables = this.state.tables.map((t,id) => <TableItem key={id} keyspace={keyspace} table={t.table_name} type="T" />)
        const views = this.state.views.map((t,id) => <TableItem key={id} keyspace={keyspace} table={t.view_name} type="V" />)

        return (
            <li className="uk-parent" style={{whiteSpace: "nowrap"}}>
                <a href="#" onClick={this.getInfo.bind(this)}><span data-uk-icon="icon: database"></span> {keyspace}</a>
                <ul className="uk-nav-sub uk-nav-parent-icon" data-uk-nav>
                    {tables}
                    {views}
                </ul>
            </li>
        )
    }
}