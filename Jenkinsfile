pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo "Fetching code from Git..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image from kaam_webapp folder..."
                sh 'docker build -t stepup-frontend ./kaam_webapp'
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Running frontend container on port 3000..."
                sh """
                    docker rm -f stepup-frontend || true
                    docker run -d --name stepup-frontend -p 3000:3000 stepup-frontend
                """
            }
        }

    }

    post {
        success {
            echo "App is available at http://<jenkins-ip>:3000"
        }
    }
}
