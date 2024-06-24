import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://172.20.10.2:3333',
})

export const baseURL =  'http://172.20.10.2:3333'