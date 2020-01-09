import React from "react"
import * as cassandra from "../service/cassandra"

export default class TableItem extends React.Component {
    state = {
        columns: []
    }

    getInfo() {
        const dict = {
            "partition_key": 0,
            "clustering": 1,
            "regular": 2,
            "static": 3
        }

        cassandra.getColumns(this.props.keyspace, this.props.table)
            .then((res) => {
                this.setState({
                    columns: res.rows.sort((a, b) => dict[a.kind] - dict[b.kind])
                })
            })
            .catch(err => console.error(err))
    }
    
    render() {
        const {keyspace, table, type} = this.props;
        
        const badgeColor = {
            "T": "#ffa500",
            "V": "#1e87f0'"
        }

        const columns = this.state.columns.map((col,  id) => {
            return (
                <li key={id}>
                    <span className="uk-badge">{col.kind}</span> {col.column_name} ({col.type})
                </li>
            )
        })

        return (
            <li className="uk-parent" style={{whiteSpace: "nowrap"}}>
                <a href="#" onClick={this.getInfo.bind(this)}>
                    <span className="uk-badge" style={{background: badgeColor[type]}}>{type}</span> {table}
                </a>
                <ul className="uk-nav-sub" data-uk-nav>
                    {columns}
                </ul>
            </li>
        )
    }
}