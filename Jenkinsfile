pipeline {
    agent any

    environment {
        NEXUS_URL = "https://nexus.example.com/repository/npm-group/"
        SONAR_HOST = "https://sonarcloud.io"
        IMAGE_NAME = "ara-culture-frontend"
        REMOTE_USER = "vexced"
        REMOTE_HOST = "192.168.100.252"
    }

    stages {
        stage('Checkout') {
            steps { git branch: 'main', url: 'https://github.com/Vexced/Ara-culture-frontend' }
        }

       stage('Install & Build') {
    steps {
        sh '''
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
            nvm use 20

            node -v
            npm -v
            npm ci
            npm run build
        '''
    }
}


        

        stage('SonarQube Analysis') {
                    steps {
                        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                            sh """
                            npm install -g sonar-scanner
                            sonar-scanner \
                            -Dsonar.projectKey=ara-culture-frontend \
                            -Dsonar.organization=vexced \
                            -Dsonar.host.url=${SONAR_HOST} \
                            -Dsonar.login=${SONAR_TOKEN}
                            """
                        }
                    }
                }

        stage('Snyk Scan') {
            steps {
                withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
                    withEnv(["SNYK_TOKEN=${SNYK_TOKEN}"]) {
                        sh '''
                            # Instala snyk localmente en el workspace si no existe
                            if [ ! -d "node_modules/snyk" ]; then
                                npm install snyk
                            fi

                            # Ejecuta el scan usando npx
                            npx snyk auth $SNYK_TOKEN
                            npx snyk test
                        '''
                    }
                }
            }
        }

        stage('Deploy to Nexus (Docker)') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'nexus-credentials',
                                    usernameVariable: 'NEXUS_USER',
                                    passwordVariable: 'NEXUS_PASSWORD')
                ]) {
                    sh '''
                        docker build -t ara-frontend:latest .
                        docker tag ara-frontend:latest localhost:8082/repository/docker-frontend/ara-frontend:latest
                        docker login -u $NEXUS_USER -p $NEXUS_PASSWORD localhost:8082
                        docker push localhost:8082/repository/docker-frontend/ara-frontend:latest
                    '''
                }
            }
        }




        stage('Deploy to Server via Docker') {
             steps {
                script {
                    def REMOTE = "${REMOTE_USER}@${REMOTE_HOST}"
                    def IMAGE_TAG = "${IMAGE_NAME}:latest"

                    sh "docker build -t ${IMAGE_TAG} ."
                    sh "docker save ${IMAGE_TAG} | bzip2 | ssh ${REMOTE} 'bunzip2 | docker load'"

                    sh """
                    ssh ${REMOTE} '
                      set -e
                      docker stop ara-frondend || true
                      docker rm ara-frontend || true
                      docker run -d --name ara-frontend -p 8081:8080 ${IMAGE_TAG}
                    '
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Aquí puedes usar kubectl, docker-compose o scripts SCP para desplegar el frontend'
            }
        }
    }

    post {
        success { echo 'Frontend desplegado correctamente' }
        failure { echo 'Falló el deploy del frontend' }
    }
}
