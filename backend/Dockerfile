#build
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
COPY . .

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o app ./cmd/server

#runtime
FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/app .

EXPOSE 8080

CMD ["./app"]
