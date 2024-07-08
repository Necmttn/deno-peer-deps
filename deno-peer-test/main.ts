import { RecordId, Surreal, Table } from "npm:surrealdb.js";
import { z } from "npm:zod";

import { Cirql, RecordSchema, any, select } from 'cirql';

const cirql = new Cirql();

await cirql.handle.connect('http://localhost:12345/');
await cirql.handle.signin({
    namespace: 'test',
    database: 'test',
    username: 'root',
    password: 'root',
});

// Define your Zod schemas
const Organisation = RecordSchema.extend({
  name: z.string(),
  isEnabled: z.boolean(),
  createdAt: z.string()
});

// Execute a select query
const organisations = await cirql.execute({
  query: select()
      .from('organisation')
      .with(Organisation) // Specify the schema
      .limit(5)
      .where({
          isEnabled: true,
      })
});

console.log('Organisations', organisations)

organisations.forEach(organisation => {
  console.log('Organisation', organisation)
})

// // Select a specific namespace / database
// await db.use({
//   namespace: "test",
//   database: "test",
// });

// // Signin as a namespace, database, or root user
// await db.signin({
//   username: "root",
//   password: "root",
// });

// let db: Surreal | undefined;

// export async function initDb(): Promise<Surreal | undefined> {
//   if (db) return db;
//   db = new Surreal();
//   try {
//     await db.connect("http://127.0.0.1:8000/rpc");
//     await db.use({ namespace: "test", database: "test" });
//     return db;
//   } catch (err) {
//     console.error("Failed to connect to SurrealDB:", err);
//     throw err;
//   }
// }

// export async function closeDb(): Promise<void> {
//   if (!db) return;
//   await db.close();
//   db = undefined;
// }

// export function getDb(): Surreal | undefined {
//   return db;
// }

// // Create a new person with a random id
// let created = await db.create("person", {
//   title: "Founder & CEO",
//   name: {
//     first: "Tobie",
//     last: "Morgan Hitchcock",
//   },
//   marketing: true,
// });

// // Update a person record with a specific id
// let updated = await db.merge(new RecordId("person", "jaime"), {
//   marketing: true,
// });

// // Select all people records
// let people = await db.select("person");

// // Perform a custom advanced query
// let groups = await db.query(
//   "SELECT marketing, count() FROM $tb GROUP BY marketing",
//   {
//     tb: new Table("person"),
//   },
// );


const db = new Surreal();

// Connect to the database
await db.connect("http://127.0.0.1:12345/rpc");

// Select a specific namespace / database
await db.use({ 
    namespace: "test", 
    database: "test" 
});

// Signin as a namespace, database, or root user
await db.signin({
    username: "root",
    password: "root",
});

// Create a new person with a random id
let created = await db.create("person", {
  title: "Founder & CEO",
  name: {
      first: "Tobie",
      last: "Morgan Hitchcock",
  },
  marketing: true,
});


console.log('Created', created)

// Update a person record with a specific id
let updated = await db.merge(new RecordId('person', 'jaime'), {
  marketing: true,
});

console.log('Updated', updated)

// Select all people records
let people = await db.select("person");

console.log('People', people)

// Perform a custom advanced query
let groups = await db.query(
  "SELECT marketing, count() FROM $tb GROUP BY marketing",
  {
      tb: new Table("person"),
  },
);

console.log('Groups', groups)


