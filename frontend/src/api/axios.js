import axios from 'axios'

// Create a custom axios instance with your backend URL as the base
const API = axios.create({
  baseURL: 'http://localhost:5000/api'  // all requests start with this
})

// This runs automatically BEFORE every request is sent
// It grabs the token from localStorage and attaches it to the header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')  // get saved login token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`  // attach it
  }
  return config
})

export default API