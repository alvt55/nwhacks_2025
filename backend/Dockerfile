FROM node:23
WORKDIR /home/app

COPY package.json .
RUN corepack enable pnpm
RUN pnpm install
COPY . .

CMD ["pnpm", "dev"]