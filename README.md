# Control & Manager - BACKEND

1. Instala las dependencias necesarias:
    ```bash
    npm install
    ```

## Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables de entorno:

```env
PORT=4000
databaseUrl='postgres://<Usuario>:<Contraseña>@localhost:5432/<BaseDeDatos>'
JWT_KEY='SECRET_KEY'
URL_FRONTEND="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

## Configuración de la Base de Datos con Docker

1. Asegúrate de tener Docker instalado en tu máquina.  
    [Descargar Docker](https://www.docker.com/get-started)

2. En el directorio se encuentra un archivo `docker-compose.yml` que puedes usar para crear un contenedor de PostgreSQL. Si eliminaste el archivo, puedes crear uno nuevo con el siguiente contenido:
```yml
    
version: '3.8'

services:
  restaurant:
    image: postgres:latest
    restart: "no"
    environment:
      POSTGRES_PASSWORD: pass_usuario // Coloca la contraseña que desees
      POSTGRES_USER: nombre_usuario // Coloca el nombre de usuario que desees
      POSTGRES_DB: name_db // Coloca el nombre de la base de datos que desees
    ports:
      - "5432:5432"
    volumes:
      - ./data:/var/lib/postgresql/data
```	

3. Levanta el contenedor de PostgreSQL ejecutando el siguiente comando en la terminal desde el directorio donde se encuentra el archivo `docker-compose.yml`:
    ```bash
    docker-compose up -d
    ```

   Esto creará un contenedor de PostgreSQL y lo iniciará en segundo plano.
   Puedes verificar que el contenedor esté corriendo con el siguiente comando:
    ```bash
    docker ps
    ```

4. Asegúrate de que la variable `databaseUrl` en el archivo `.env` esté correctamente configurada para conectarse a la base de datos.
    Por ejemplo:
     ```env
     databaseUrl='postgres://nombre_usuario:pass_usuario@localhost:5432/name_db'
     ```

## Ejecución del Proyecto

1. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

2. Accede a la aplicación en tu navegador en [http://localhost:4000](http://localhost:4000).

## Notas

- Asegúrate de que el contenedor de PostgreSQL esté corriendo antes de iniciar el servidor.
- Si necesitas realizar migraciones o seeders en la base de datos, utiliza las herramientas de tu ORM o framework en este caso se utiliza `Sequelize`.

---
