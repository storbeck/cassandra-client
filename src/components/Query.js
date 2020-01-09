import React from "react"
import AceEditor from "react-ace"
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

import * as cassandra from "../service/cassandra"
import "ace-builds/src-noconflict/mode-sql"
import "ace-builds/src-noconflict/theme-sqlserver"

import 'brace/ext/language_tools';

export default class Query extends React.Component {

    data = [
        ['', 'Tesla', 'Mercedes', 'Toyota', 'Volvo'],
        ['2019', 10, 11, 12, 13],
        ['2020', 20, 11, 14, 13],
        ['2021', 30, 15, 12, 13]
    ];

    state = {
        query: "",
        has_results: false,
        error_msg: "",
        col_def: [],
        row_data: []
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
        cassandra.executeQuery(this.refs.ace.editor.getSelectedText() || this.state.query)
            .then(res => {

                // stringify objects to prevent [object Object] from showing in the table
                const isObject = n => Object.prototype.toString.call(n) === '[object Object]'
                const rows = res.rows.map(row => {
                    let stringified = {};
                    Object.keys(row).forEach(col => {
                        stringified[col] = isObject(row[col]) ? JSON.stringify(row[col]) : row[col];
                    })
                    return stringified;
                })

                let colDefs = res.columns.map(col => col.name)
                this.setState({col_def: colDefs, row_data: rows, has_results: true, error_msg: ""})
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
                            ref="ace"
                            root="ace"
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
                    <a className="uk-button uk-button-default" href="#" onClick={() => this.makeQuery()} style={{margin: 10, marginRight: 25}}>Run</a>
                </div>

                { this.state.error_msg.length > 0 ? <div className="validation-state error">{this.state.error_msg}</div> : null }

                { this.state.has_results ?
                    <HotTable 
                        root="hot"
                        ref="hot"
                        style={{fontSize: 12, marginRight: 25}}
                        data={this.state.row_data} 
                        columns={this.state.col_def.map(col => {
                            return { data: col, type: "text" }
                        })}
                        colHeaders={this.state.col_def} 
                        rowHeaders={true} 
                        stretchW={true}
                        height="550"
                        manualRowResize={true}
                        manualColumnResize={true}
                        dropdownMenu={true}
                        filters={true}
                        headerTooltips={{
                            rows: true,
                            columns: true,
                            onlyTrimmed: false
                        }}
                        contextMenu={true}
                        /> : null }
            </div>
        )
    }
}