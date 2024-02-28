import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// async function main() {
//   await prisma.user.create({
//     data: {
//       email: `testemail@gmail.com`,
//       role: 'ADMIN',
//     },
//   })

//   await prisma.category.createMany({
//     //data: links,
//   })
// }


import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("Couldn't find db url");
}
const sql = postgres(dbUrl);

async function main() {
  await sql`
       create or replace function handle_new_user()
       returns trigger as $$
       begin
           insert into public.user (id)
           values (new.id);
           return new;
       end;
       $$ language plpgsql security definer;
       `;
  await sql`
       create or replace trigger on_auth_user_created
           after insert on auth.users
           for each row execute procedure handle_new_user();
     `;

  await sql`
       create or replace function handle_user_delete()
       returns trigger as $$
       begin
         delete from auth.users where id = old.id;
         return old;
       end;
       $$ language plpgsql security definer;
     `;

  await sql`
       create or replace trigger on_profile_user_deleted
         after delete on public.user
         for each row execute procedure handle_user_delete()
     `;

  console.log("Finished adding triggers and functions for profile handling.");

  process.exit();
}

main();
