import { create } from 'apisauce'

const client = create({
    baseURL: "http://localhost:5000/api/",
})

export default client