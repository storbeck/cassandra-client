const driver = require('cassandra-driver')
const fs = require('fs')

let client

export function connect (contactPoints, username, password, port = 9042, sslEnabled = false, certificate) {
  return new Promise((resolve, reject) => {

    const sslOptions = (sslEnabled && certificate.length > 0) ? { ca: [fs.readFileSync(certificate)] }: false;

    client = new driver.Client({
      contactPoints: contactPoints.split(','),
      protocolOptions: { port: port },
      authProvider: new driver.auth.PlainTextAuthProvider(username, password),
      sslOptions: sslOptions
    })

    client.connect(err => {
      if (err) reject(err)
      resolve()
    })
  })
}

export function disconnect () {
    return new Promise((resolve, reject) => {
        client.shutdown(err => {
            console.log(err)
            resolve()
        })
    })
}

export function executeQuery (query) {
  return client.execute(query)
}

export function getKeyspaces () {
  client.keyspace = 'system_schema'
  return client.execute('select keyspace_name from keyspaces')
}

export function getTables (keyspace) {
  const query = 'select keyspace_name, table_name from tables where keyspace_name = ?'
  return executePreparedQuery('system_schema', query, [keyspace])
}

export function getViews (keyspace) {
  const query = 'select * from views where keyspace_name = ?'
  return executePreparedQuery('system_schema', query, [keyspace])
}

export function getColumns (keyspace, table) {
  const query = 'select * from columns where keyspace_name=? and table_name=?'
  return executePreparedQuery('system_schema', query, [keyspace, table])
}

function executePreparedQuery (keyspace, query, params) {
  client.keyspace = keyspace
  return client.execute(query, params, {prepare: true})
}
