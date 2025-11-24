pipeline {
    agent any

    environment {
        REPO_NAME = 'stepup'
        CONTAINER_NAME = 'stepup'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        APP_DIR = './kaam_webapp'
        APP_PORT = 3000
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo "Fetching latest code..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image ${REPO_NAME}:${IMAGE_TAG}..."
                sh "docker build --no-cache -t ${REPO_NAME}:${IMAGE_TAG} ${APP_DIR}"
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Stopping old container and freeing port..."
                sh """
                    # Stop and remove old container
                    docker rm -f ${CONTAINER_NAME} || true

                    # Remove any stale networks
                    docker network prune -f

                    # Find a free host port dynamically
                    HOST_PORT=\$(comm -23 <(seq 3000 3100) <(ss -Htan | awk '{print \$4}' | sed 's/.*://')) | head -n1

                    echo "Starting container on port \$HOST_PORT..."
                    docker run -d --name ${CONTAINER_NAME} -p \$HOST_PORT:${APP_PORT} ${REPO_NAME}:${IMAGE_TAG}

                    echo "Application running on host port \$HOST_PORT"
                """
            }
        }
    }

    post {
        success {
            echo "Build and deployment successful!"
        }
        failure {
            echo "Build or deployment failed. Check logs above."
        }
    }
}
