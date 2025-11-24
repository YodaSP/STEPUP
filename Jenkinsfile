pipeline {
    agent any

    environment {
        // Dynamically extract repo name from the Git URL
        REPO_NAME = "${env.GIT_URL.split('/').last().replace('.git', '')}"
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
                echo "Stopping old container if exists..."
                sh "docker rm -f ${REPO_NAME} || true"

                echo "Running new container on port 3000..."
                sh """
                    docker run -d --name ${REPO_NAME} -p 3000:3000 ${REPO_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "App deployed successfully!"
            echo "Open: http://<jenkins-ip>:3000"
        }
    }
}
