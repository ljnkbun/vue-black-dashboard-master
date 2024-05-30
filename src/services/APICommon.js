import axios from "axios";

const BASE_DOMAIN = "https://localhost:7108";
const BASE_URL = `${BASE_DOMAIN}/api`;

const instance = axios.create({
    baseURL: BASE_URL,
    header: { "Content-Type": "application/json" }
});

export default instance