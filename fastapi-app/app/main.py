from fastapi import FastAPI, Request
from prometheus_client import Counter, generate_latest, CollectorRegistry, REGISTRY, make_asgi_app
import logging
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# Configure logger
log_file = "./logs/app.log"
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["DELETE", "GET", "POST", "PUT"],
    allow_headers=["*"],
)
# Prometheus metrics setup
request_count = Counter('http_requests_total', 'Total number of HTTP requests', ['method', 'status', 'path'])

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    response = await call_next(request)
    duration = (datetime.now() - start_time).total_seconds()
    log_message = f"{request.method} {request.url.path} {response.status_code} {duration:.3f}s"
    logging.info(log_message)
    request_count.labels(method=request.method, status=response.status_code, path=request.url.path).inc()
    return response

# Using multiprocess collector for registry
def make_metrics_app():
    registry = CollectorRegistry()
    multiprocess.MultiProcessCollector(registry)
    return make_asgi_app(registry=registry)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.get("/ping")
def ping():
    return {"status": "pong"}

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)