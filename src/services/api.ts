import axios from 'axios'

export const api = axios.create({
    baseURL: "https://chatbox-server-production.up.railway.app/"
})
