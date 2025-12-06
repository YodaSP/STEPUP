pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                echo "Fetching latest code..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh "docker build --no-cache -t stepup:build-${BUILD_NUMBER} ./kaam_webapp"
            }
        }

        stage('Run Docker Container') {
    steps {
        echo "Stopping old container and running new one..."

        sh """
            echo "Looking for existing container named 'stepup'..."

            # If container named 'stepup' exists, stop & remove it
            if docker ps -a --format '{{.Names}}' | grep -w stepup >/dev/null 2>&1; then
                echo "Existing container 'stepup' found. Removing..."
                docker rm -f stepup
            else
                echo "No existing container named 'stepup' found. Continuing..."
            fi

            echo "Starting new container: stepup (image: stepup:build-${BUILD_NUMBER})"

            docker run -d --name stepup -p 3000:3000 stepup:build-${BUILD_NUMBER}
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
