### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

### Deploy image lên server (VPS)

Giả sử bạn đã push image lên Docker Hub (ví dụ: `hq259/demo-1:latest`). Trên server (Ubuntu/Debian là phổ biến nhất), bạn làm theo 1 trong 2 cách dưới đây.

#### Cách 1 (nhanh nhất): chạy trực tiếp với `docker run`

1) Cài Docker trên server (Docker Engine + Docker Compose plugin).

2) Pull image và chạy container:

```bash
docker pull hq259/demo-1:latest

docker stop demo-1 2>/dev/null || true
docker rm demo-1 2>/dev/null || true

docker run -d \
	--name demo-1 \
	-p 80:80 \
	--restart unless-stopped \
	hq259/demo-1:latest
```

3) (Nếu có firewall) mở port HTTP/HTTPS:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Sau đó truy cập `http://<SERVER_IP>/`.

#### Cách 2 (khuyến nghị): deploy bằng Docker Compose (kéo image từ Docker Hub)

Repo đã có sẵn file `docker-compose.prod.yml` để chạy từ image trên Docker Hub.

1) Trên server, tạo thư mục deploy và đưa file `docker-compose.prod.yml` vào đó (copy/paste hoặc scp).

2) Chạy:

```bash
cd /opt/demo-1

IMAGE=hq259/demo-1:latest docker compose -f docker-compose.prod.yml up -d
```

Update version sau này:

```bash
cd /opt/demo-1

IMAGE=hq259/demo-1:latest docker compose -f docker-compose.prod.yml pull
IMAGE=hq259/demo-1:latest docker compose -f docker-compose.prod.yml up -d
```

#### Domain (tuỳ chọn)

Trỏ DNS A record của domain về IP server. Nếu cần HTTPS, bạn thường sẽ đặt thêm reverse proxy (Caddy/Nginx/Traefik) phía trước container.

### Deploy tự động bằng GitHub Actions (tuỳ chọn)

Repo có sẵn workflow `.github/workflows/deploy-server.yaml` để bạn bấm chạy (manual) và nó sẽ SSH lên server để:
- Upload `docker-compose.prod.yml` vào server
- Pull image và `docker compose up -d`

Bạn cần tạo các GitHub Secrets:
- `SERVER_HOST`: IP/domain server
- `SERVER_USER`: user SSH (ví dụ `root` hoặc `ubuntu`)
- `SERVER_SSH_KEY`: private key để SSH

Nếu server SSH không chạy port 22 thì khi chạy workflow, điền input `server_port`.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.