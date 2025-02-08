import express from 'express'
import client from 'prom-client'
import fs from 'fs'
import morgan from 'morgan'

const app = express()
const port = 3030

// Create a writable log stream
const logStream = fs.createWriteStream('./logs/app.log', { flags: 'a' })

// Log every request using morgan
app.use(morgan('combined', { stream: logStream }))

// Prometheus metrics setup
const register = new client.Registry()
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status', 'path'],
})
register.registerMetric(httpRequestCounter)

// Default Prometheus metrics
client.collectDefaultMetrics({ register })

// Middleware to track successful HTTP requests for Prometheus
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            status: res.statusCode,
            path: req.path,
        })
    })
    next()
})

// Sample Routes
app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.get('/demo', (req, res) => {
    res.send('Hello, demo!')
})

// Metrics route for Prometheus
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType)
        res.send(await register.metrics())
    } catch (error) {
        logError('Failed to fetch Prometheus metrics', error)
        res.status(500).send('Internal Server Error')
    }
})

// 404 Handler for all unmatched routes
app.use((req, res) => {
    const logMessage = `${new Date().toISOString()} - 404 Not Found - ${req.method} ${req.originalUrl}\n`
    logStream.write(logMessage)
    console.error(logMessage.trim())
    res.status(404).send('Not Found')
})

// Error handling middleware for any exceptions
app.use((err, req, res, next) => {
    logError('Unhandled application error', err)
    res.status(500).send('Something went wrong!')
})

// Log uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
    logError('Uncaught Exception', error)
    process.exit(1)
})

process.on('unhandledRejection', (reason) => {
    logError('Unhandled Rejection', reason)
})

// Utility function to log errors
function logError(message, error) {
    const logMessage = `${new Date().toISOString()} - ERROR: ${message}\n${error.stack || error}\n`
    logStream.write(logMessage)
    console.error(logMessage.trim())
}

app.listen(port, () => {
    console.log(`Express app running at http://localhost:${port}`)
})
