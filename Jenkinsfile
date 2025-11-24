pipeline {
    agent any

    environment {
        // Extract repo name from Git URL and convert to lowercase for Docker
        REPO_NAME = "${env.GIT_URL.split('/').last().replace('.git', '').toLowerCase()}"
        IMAGE_TAG = "build-${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "Cleaning old workspace..."
                deleteDir()
                
                echo "Fetching latest code from Git..."
                checkout scm
                
                echo "Using repo name: ${REPO_NAME}"
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building new Docker image with tag ${IMAGE_TAG}..."
                sh """
                    docker build --no-cache -t ${REPO_NAME}:${IMAGE_TAG} ./kaam_webapp
                """
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Stopping old container (if exists) and running new container..."
                sh """
                    docker rm -f ${REPO_NAME} || true
                    docker run -d --name ${REPO_NAME} -p 3000:3000 ${REPO_NAME}:${IMAGE_TAG}
                """
            }
        }

    }

    post {
        success {
            echo "App is available at http://<jenkins-ip>:3000"
        }
        failure {
            echo "Build or deployment failed. Check logs above."
        }
    }
}
