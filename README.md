# Budget Application

TODO:

- [x] Add SuperBase DB
- [x] Set Up Log In
- [x] Add API
- [ ] Add Tests
- [x] Set Up Basic Layout
- [x] Add Styling

## Getting Started

1. First, install the packages

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Log In Test User

Link to information for env file: https://docs.google.com/document/d/1_y8B_il5FGY1lNv15eS6pXflb-MJNSwpVTM0TqvuTg4/edit?usp=sharing
email: testuser@gmail.com
password: "testpassword"

## Process

1. Designed Basic DB structure Using Prisma
2. Set up TrpC handling and zod validation schemas
3. Set Up API Calls with Prisma Client and trpc
4. Created Base Structure for Front End application
5. Connected to API and set up tables.
6. Didnt Get To: Brush up styling and make more visually modern.

### Time

### Improvements

- Add more validation on the frontEnd Side
- Create A better central user managament system
- Add converter for money and handler to deal with cash inputs.
- Add Cypress and Jest testing so there is E2E tests

### Known Issues

- Pagination shifts all data

## Technical Stack

- SuperBase
- Prisma
- tRPC
- NextJS
- Mantine UI
