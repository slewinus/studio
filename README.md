# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Database setup (Postgres)

1.  Make sure Docker is running.
2.  Run `docker-compose up -d` to start the Postgres database.
3.  Run `npx prisma migrate dev` to run the migrations and update the database schema.
4.  Run `npx prisma generate` to generate the Prisma client.

## Development

Run `npm run dev` to start the development server.
