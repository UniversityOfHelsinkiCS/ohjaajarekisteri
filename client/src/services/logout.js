import axios from 'axios'
import url from './config'

const baseUrl = url + 'api/logout'

const logout = async () => {
  const { data } = await axios.get(baseUrl)

  return data.logoutUrl
}

export default { logout }

