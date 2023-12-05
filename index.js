import http from "node:http"
import fs from "node:fs/promises"

import { sendError } from "./modules/send.js"
import { checkFileExist, createFileIfNotExist } from "./modules/checkFiles.js"
import { handleComediansRequest } from "./modules/handleComediansRequest.js"
import { handleAddClient } from "./modules/handleAddClient.js"
import { handleClientsRequest } from "./modules/handleClientsRequest.js"
import { handleUpdateClient } from "./modules/handleUpdateClient.js"
import { error } from "node:console"

const PORT = 8080
const COMEDIANS = './comedians.json'
export const CLIENTS = './clients.json'

const startServer = async (port) => {
    if (!(await checkFileExist(COMEDIANS))) return

    await createFileIfNotExist(CLIENTS)

    const comediansData = await fs.readFile(COMEDIANS, "utf-8")
    const comedians = JSON.parse(comediansData)

    const server = http.createServer(async (req, res) => {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*")
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
            res.setHeader("Access-Control-Allow-Headers", "Content-Type")

            if (req.method === 'OPTIONS') {
                res.writeHead(204)
                res.end()
                return
            }

            const segments = req.url.split("/").filter(Boolean)

            if (!segments.length) {
                sendError(res, 404, 'Not found')
                return
            }

            const [ resource, id ] = segments

            if (req.method === "GET" && resource === "comedians") {
                handleComediansRequest(req, res, comedians, id)
                return
            }

            if (req.method === "POST" && resource === "clients") {
                handleAddClient(req, res)
                return
            }

            if (req.method === "GET" && resource === "clients" && id) {
                handleClientsRequest(req, res, id)
                return
            }

            if (req.method === "PATCH" && resource === "clients" && id) {
                handleUpdateClient(req, res, id)
                return
            }

            sendError(res, 404, 'Not found')
        } catch (error) {
            sendError(res, 500, `Ошибка сервера: ${error}`)
        }
    })
    
    server.listen(port, () => {
        console.log(`http://localhost:${PORT}`)
    })

    server.on('error', (error) => {
        if (error.code = 'EADDRINUSE') {
            console.log(`Порт ${port} занятб, пробуем запустить на порту ${port + 1}`)
            startServer(port + 1)
        } else {
            console.error(`Возникла ошибка ${error}`)
        }
    })
}

startServer(PORT)



// npm install nodemon -D

// git config --global user.name "Maga"
// git config --global user.email "maga010dag@gmail.com"
// git init
// git add package.json
// git status
// git commit -m 'add package.json'
// git switch -c day1
// git add .
// git commit -m 'add'

// git switch master

// git remote add origin https://github.com/maga-magomedov/comedians.git
// git branch -M main
// git push -u origin main

// git switch -c day1
// git push --set-upstream origin day1