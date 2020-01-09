import React from "react"
import {AgGridReact} from "ag-grid-react"
import AceEditor from "react-ace"

import * as cassandra from "../service/cassandra"
import "ace-builds/src-noconflict/mode-sql"
import "ace-builds/src-noconflict/theme-sqlserver"

export default class Query extends React.Component {
    state = {
        query: "",
        has_results: false,
        error_msg: "",
        aggridColumnDefs: [],
        aggridRowData: []
    }

    copyListener(event) {
        const copyToClipboard = str => {
            const el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        };

        if ((event.metaKey || event.ctrlKey) && event.key === "c" && this.state.gridOptions) {
            this.state.gridOptions.api.flashCells({rowNodes: [this.state.selectedCell.node], columns: [this.state.selectedCell.column.colId]})
            copyToClipboard(this.state.selectedCell.value);
        }
    }

    makeQuery() {
        cassandra.executeQuery(this.state.query)
            .then(res => {
                let colDefs = res.columns.map(col => {
                    return { headerName: col.name, field: col.name }
                })

                this.setState({aggridColumnDefs: colDefs, aggridRowData: res.rows, has_results: true, error_msg: ""})
            })
            .catch(err => {
                this.setState({error_msg: err.message})
            })
    }

    render() {
        return (
            <div style={{width: "100%", padding: 5}}>
                <div style={{display: "flex", alignItems: "center", marginBottom: 10}}>
                        <AceEditor
                            style={{border: "1px solid #ccc"}}
                            mode="sql"
                            theme="sqlserver"
                            width="100%"
                            height="80px"
                            enableBasicAutocompletion={true}
                            enableLiveAutocompletion={true}
                            onChange={val => this.setState({query: val})}
                            value={this.state.query}
                            name="sql_editor"
                            editorProps={{ $blockScrolling: true }}
                            commands={[{
                                name: 'execute',
                                bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
                                exec: () => { this.makeQuery() }
                              }]}
                        />
                    <a className="uk-button uk-button-default" href="#" onClick={this.makeQuery} style={{margin: 10, marginRight: 25}}>Run</a>
                </div>

                { this.state.error_msg.length > 0 ? <div className="validation-state error">{this.state.error_msg}</div> : null }

                <div style={{width: 'calc(100% - 25px)', height: '550px'}} onKeyDown={this.copyListener.bind(this)} className='ag-theme-balham'>
                    {this.state.has_results ?
                    <AgGridReact
                        columnDefs={this.state.aggridColumnDefs}
                        rowData={this.state.aggridRowData}
                        enableSorting
                        enableFilter
                        pagination
                        paginationPageSize={100}
                        onCellClicked={(cell) => this.setState({selectedCell: cell})}
                        onGridReady={(params) => this.setState({gridOptions: params})}
                        rowSelection='multiple' /> : null }
                    </div>
            </div>
        )
    }
}