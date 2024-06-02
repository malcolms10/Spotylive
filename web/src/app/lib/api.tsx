import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.100.26:3333',
})

export const baseURL =  'http://192.168.100.26:3333'