# Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /src
COPY package.json package-lock.json ./
RUN yarn config set network-timeout 100000
RUN yarn install

# Rebuild the source code only when needed
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /src/node_modules ./node_modules

COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 artistic_job_tracker
RUN adduser --system --uid 1001 artistic_job_tracker

COPY --from=builder /src/public ./public
COPY --from=builder /src/package.json ./package.json

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=artistic_job_tracker:artistic_job_tracker /src/.next/standalone ./
COPY --from=builder --chown=artistic_job_tracker:artistic_job_tracker /src/.next/static ./.next/static

USER artistic_job_tracker

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
