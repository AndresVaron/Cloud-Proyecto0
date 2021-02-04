FROM node:lts as front
WORKDIR /usr/src/app
COPY /frontend/package*.json ./
RUN npm install
COPY ./frontend/ .
# RUN sed -i "s|"",|'http://172.24.98.180:8080/api',|g" src/AxiosAPI.js
RUN sed -i "s|'',|'http://localhost:8080/api',|g" src/AxiosAPI.js
RUN npm run-script build

FROM python:3.9-slim as base

# Setup env
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1

FROM base AS python-deps

# Install pipenv and compilation dependencies
RUN pip install pipenv
RUN apt-get update && apt-get install -y --no-install-recommends gcc

# Install python dependencies in /.venv
COPY Pipfile .
COPY Pipfile.lock .
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy


FROM base AS runtime

# Copy virtual env from python-deps stage
COPY --from=python-deps /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

# Create and switch to a new user
RUN useradd --create-home appuser
WORKDIR /home/appuser
USER appuser

# Install application into container
COPY . .

RUN sed -i "s|debug=True|host='0.0.0.0'|g" app.py

COPY --from=front /usr/src/app/build/ ./frontend/build

# Run the application
ENTRYPOINT ["python", "app.py", "--host", "0.0.0.0"]