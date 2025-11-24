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
                    # Stop and remove old container if exists
                    docker rm -f stepup || true

                    # Run new container
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
