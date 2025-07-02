## Basic commands

- `docker build -t <docker_image_name> .` // make docker image in current directory
- `docker images` to list all images
- `docker rmi <image_name> -rf`  
- `docker run -p 3000:3000 <docker_img>`

## Volumes and Networks

1. Before we start, you should know one more use case of Docker
2. Docker is used to run DBs/Redis/Auxiliary services locally
3. This is useful so we don’t pollute our filesystem with unnecessary dependencies
4. We can bring up and down DBs/Redis/Kafka and clean out our machine

### There is one problem
- We want local databases to retain information across restarts (Volumes)
- We want to allow one docker container to talk to another docker container (Networks)


`sudo docker run -p 27017:27017 mongo` => to run mongo db container on port 27017

- `sudo docker ps` => command to list all docker container running
- `sudo docker ps -a` => command to list all docker container running + stop
- `-a or -all` and `ps` => process status


- `docker kill <container_name or container_id>`
- `docker stop <container_name or container_id>` - you can rerun it by replaceing stop with run

```
sudo docker exec -it <container_id> /bin/bash
```

| Part           | Explanation                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| `sudo`         | Run the command with root privileges (required for Docker without group setup) |
| `docker`       | CLI tool to interact with Docker                                               |
| `exec`         | Tells Docker to **run a command in a running container**                       |
| `-i`           | Interactive: Keep STDIN open (so you can type input)                           |
| `-t`           | Allocate a **pseudo-TTY** (makes the shell work like a real terminal)          |
| `28b948a45fad` | The **container ID** you want to run the command inside                        |
| `/bin/bash`    | The **command** to run inside the container — in this case, Bash shell         |


view `/data/db` directory (MongoDB data)


- Docker containers share the host OS kernel (e.g., Linux) but have their own filesystem, network, process space, and libraries.

- Containers are lightweight and start much faster than virtual machines (VMs).
- By default docker container are independent but can share Volumes (shared file system), Networks (to communicate with other containers), Environment variables, host mounts, etc.


## Volumes

Used for persisting data across starts

Specifically useful for things like databases

How?

```
sudo docker volume create volume_database
sudo docker run -v volume_database:/data/db -p 27017:27017 mongo
// -p stand for the port
// -v stand for volume
```

- `docker volume create volume3` => for creating volume
- `docker ls`
- `docker run -v volume3:/data/db -p 27017:27017 mongo`


docker container cannot connect with outside on localhost so we use the `Networks`

```
docker network create my_custom_network
docker build -t test4 .
sudo docker run -v volume3:/data/db -p 27017:27017 --name mongodb4 --network network1 mongo
sudo docker run -p 3000:3000 --network network1  test4

```

MONGO_URI="localhost" node index.js

`docker run -p 3000:3000 -e MONGO_URI=mongo<image_tag>`
 

 ```
 // Not working
 sudo docker run -p 3000:3000   --network network1   -e MONGO_URI="mongodb://mongodb7:27017/newdata" test4

sudo docker run -v volume3:/data/db -p 27017:27017 --network network1 --name mongodb7  mongo

 ```

 ```
FROM node:20 AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base AS development
COPY ..
RUN npm prune --development
CMD ["npm", "run", "dev"]


FROM base AS production
COPY ..
RUN npm prune --production
CMD ["npm", "run", "start"]
```

# Building dev

```
sudo docker build . --target development -t  app:dev
sudo docker run app:dev


sudo docker build . --target production -t app:prod
sudo docker run app:prod
docker run -e MONGO_URI=mongodb://localhost:27017/mydatabase -p 3000:3000
-v .:/usr/src/app myapp:dev
```


## Problem

- if we make a build of application like and we want to change the code we have to make another build to update the  docker build, to avoid this what can we do


sudo docker run -r MONGO_URI=mongodb://localhost:27017/test -p 3000:3000 -v .:/usr/app myapp:dev


sudo docker run -v .:/usr/src/app app:dev

sudo docker exec -it <container_id> /bin/bash

remove the index.js
it will also remove in your directory also


## Problem -
A project has a lot of auxiliary services it needs to use for example, mongodb/postgres/kafka/mysql ...
we have to run every service on different terminal, or use detached mode

docker compose tool for running multiple container using one commad 
- we use yaml, toml file to make basic struction which we want to run 
- docker compose create network itself so we won't have to worry about connecting
- `sudo docker-compose -f docker-compose.yaml up`
