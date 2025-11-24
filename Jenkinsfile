pipeline {
    agent any

    environment {
        REPO_NAME = "stepup"
        IMAGE_TAG = "build-${env.BUILD_NUMBER}"
        APP_DIR = "./kaam_webapp"
        PORT = "3000"
        CONTAINER_NAME = "stepup"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
                echo "Using repo name: ${REPO_NAME}"
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building new Docker image with tag ${IMAGE_TAG}..."
                sh """
                    docker build --no-cache -t ${REPO_NAME}:${IMAGE_TAG} ${APP_DIR}
                """
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Stopping old container and freeing port ${PORT}..."
                sh """
                    # Stop any container with the same name
                    docker rm -f ${CONTAINER_NAME} || true

                    # Kill any process using the port
                    lsof -ti:${PORT} | xargs -r kill -9

                    # Run the new container
                    docker run -d --name ${CONTAINER_NAME} -p ${PORT}:${PORT} ${REPO_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "Build and deployment succeeded!"
        }
        failure {
            echo "Build or deployment failed. Check logs above."
        }
    }
}
