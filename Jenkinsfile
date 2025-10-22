pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/var/www/html"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', credentialsId: 'github-creds', url: 'https://github.com/pavanmarulappa/simpletodoapp.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'sudo systemctl restart simpletodo.service'
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                // Copy build files to deployment directory
                sh '''
                sudo rm -rf ${DEPLOY_DIR}/*
                sudo cp -r frontend/dist/* ${DEPLOY_DIR}/
                sudo systemctl restart nginx
                sudo systemctl restart simpletodo.service || true
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
