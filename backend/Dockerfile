# Use a minimal base image with Python 3.12 installed
FROM python:3.12-slim

RUN apt update && apt install -y curl && apt clean && rm -rf /var/lib/apt/lists/*
# Set the working directory inside the container to /app
WORKDIR /app

# Copy only the requirements file first (for better layer caching)
COPY requirements.txt .

# Install Python dependencies without keeping cache (reduces image size)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose port 5001 so it can be mapped externally
EXPOSE 5001

# Define the default command to run the app with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5001"]