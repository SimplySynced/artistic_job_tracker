# Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn-lock.json ./
RUN yarn config set network-timeout 100000
RUN yarn install 

# Rebuild the source code only when needed
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 artistic_job_tracker
RUN adduser --system --uid 1001 artistic_job_tracker

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=artistic_job_tracker:artistic_job_tracker /app/.next/standalone ./
COPY --from=builder --chown=artistic_job_tracker:artistic_job_tracker /app/.next/static ./.next/static

USER artistic_job_tracker

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
