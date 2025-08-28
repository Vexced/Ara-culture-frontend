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
            apt-get update && apt-get install -y zip
            zip -r ara-frontend.zip dist
        '''
    }
}


        
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        # Instala sonar-scanner localmente en node_modules del proyecto
                        npm install sonar-scanner --no-save

                        # Ejecuta sonar-scanner usando npx
                        npx sonar-scanner \
                            -Dsonar.projectKey=ara-culture-frontend \
                            -Dsonar.organization=vexced \
                            -Dsonar.host.url=${SONAR_HOST} \
                            -Dsonar.login=$SONAR_TOKEN
                    '''
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

        stage('Deploy to Nexus') {
        steps {
            withCredentials([usernamePassword(credentialsId: 'nexus-credentials',
                                                usernameVariable: 'NEXUS_USER',
                                                passwordVariable: 'NEXUS_PASSWORD')]) {
                sh '''
                     # Asegurarse de que el ZIP existe
                    ls -l ara-frontend.zip
                    
                    curl -u $NEXUS_USER:$NEXUS_PASSWORD \
                            --upload-file ara-frontend.zip \
                            http://localhost:8082/repository/npm-group/ara-frontend.zip
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
                      ddocker stop ara-frontend || true 
                      docker rm ara-frontend || true
                      docker run -d --name ara-frontend -p 8081:80 ${IMAGE_TAG}
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
