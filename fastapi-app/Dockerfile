# Use official Python image from Docker Hub
FROM python:3.13-slim

# Set the working directory to /app (where your main.py is located)
WORKDIR /app

# Copy the requirements.txt into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app directory content into the container
COPY app /app

# Expose port 8888
EXPOSE 8888

# Run the FastAPI application using Uvicorn on port 8888
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8888"]
