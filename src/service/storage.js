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
        return resolve(data)
      })
  })
}

export function setConnection (contact_points, username, password, port, sslEnabled, certificate) {
  store.set(
    'connection',
    {
      contact_points: contact_points,
      username: username,
      password: password,
      port: port,
      sslEnabled: sslEnabled,
      certificate: certificate
    },
    (err) => { if (err) console.error(err) })
}
