const keytar = require('keytar')
const electron = require('electron')
const store = require('electron-json-storage')
const path = require('path')

const userDataPath = (electron.app || electron.remote.app).getPath('userData')
store.setDataPath(path.join(userDataPath, 'user-preferences'))

export function getConnection () {
  return new Promise((resolve, reject) => {
    store.get(
      'connection',
      (err, data) => {
        if (err) reject(err)

        if (data.username) {
          data.password = keytar.getPassword("CassandraClient", data.username);
          keytar.getPassword("CassandraClient", data.username)
            .then(val => {
              data.password = val

              return resolve(data)
            })
            .catch(err => console.error(err))
        }
      })
  })
}

export function setConnection (contact_points, username, password, port, sslEnabled, certificate) {

  if (!username || !password) throw "Username or Password not provided"
  keytar.setPassword("CassandraClient", username, password)

  store.set(
    'connection',
    {
      contact_points: contact_points,
      username: username,
      port: port,
      sslEnabled: sslEnabled,
      certificate: certificate
    },
    (err) => { if (err) console.error(err) })
}