import axios from 'axios'
import url from './config'

const baseUrl = url + 'api/login'

const id = Math.random().toString(36).slice(2)

const login = async (role) => {
  try {
    const student = {
//      uid: 'UToska' + id,
      uid: 'UToska',
      hypersonid: id,
      givenName: 'UusiHenkilö',
      sn: 'Toska',
      mail: 'grp-toska+ohrekstudent@helsinki.fi',
    }

    const admin = {
      uid: 'VToska',
      givenName: 'VanhaHenkilö',
      sn: 'Ex-Toskalainen',
      employeeNumber: '123161',
      mail: 'grp-toska+ohrekadmin@helsinki.fi',
    }

    if (!role) {
      const response = await axios.post(baseUrl, null)
      return response.data
    }

    const response = await axios.post(baseUrl, null,
      {
        headers: role === 'student' ? student : admin
      })
    return response.data
  } catch (error) {
    const status = error.response.status
    if (status === 500) {
      return { error: 'Unable to connect to server.' }
    } else if (status === 400) {
      return { error: 'Username or password missing.' }
    } else if (status === 401) {
      return { error: 'Username or password is incorrect.' }
    } else {
      return { error: 'Unable to connect to server.' }
    }
  }
}

export default { login }

