

![Prometheus + Grafana + Loki + Promtail](https://github.com/webhkp/prometheus-grafana-loki-promtail/graphana-prometheus-loki-promtail.png)

# Overview
--------------------
We are showing the log data collection process and flow in this repository.

This project consists of two separate applications: an Express.js app and a FastAPI app. Both applications are containerized using Docker and orchestrated with Docker Compose. The project also includes Prometheus and Grafana for monitoring, and Loki and Promtail for logging.

# Structure
--------------------

* `express-app`: contains the Express.js application code
* `fastapi-app`: contains the FastAPI application code
* `docker-compose.yml`: defines the Docker Compose configuration
* `prometheus.yml`: defines the Prometheus configuration
* `grafana-provisioning`: contains Grafana provisioning files
* `loki`: contains Loki configuration files
* `promtail`: contains Promtail configuration files

# Running the Project(s)
--------------------
Search for `<IP_OF_THE_MACHINE>` in the project, and replace that with your machine IP address.

Here are the files where you would find it-
- prometheus.yml
- express-app/promtail-config.yml
- fastapi-app/promtail-config.yml

## Step 1: Run Prometheus, Grafana, and Loki Containers

To run the Prometheus, Grafana, and Loki containers, navigate to the project root directory and run the following command:

```bash
docker-compose up
```
This will start the Prometheus, Grafana, and Loki containers.

## Step 2: Run Express App and Promtail for Express

To run the Express app and Promtail for Express, navigate to the `express-app` directory and run the following command:

```bash
cd express-app

docker-compose up
```
This will start the Express app and Promtail for Express containers.

## Step 3: Run FastAPI App and Promtail for FastAPI

To run the FastAPI app and Promtail for FastAPI, navigate to the `fastapi-app` directory and run the following command:

```bash
cd fastapi-app

docker-compose up
```
This will start the FastAPI app and Promtail for FastAPI containers.

# Application URLs
--------------------

* Express.js App: `http://localhost:3030`
* FastAPI App: `http://localhost:8888`

# Monitoring and Logging
--------------------

* Prometheus: `http://localhost:9090`
* Grafana: `http://localhost:3000`
* Loki: `http://localhost:3100`
