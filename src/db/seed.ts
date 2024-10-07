import dayjs from "dayjs";
import { client, db } from ".";
import { goalsCompletions, goals } from "./schema";

async function seed() {
  await db.delete(goalsCompletions);
  await db.delete(goals);

  const goalsResult = await db
    .insert(goals)
    .values([
      { title: "Acordar cedo", desiredWeeklyFrequency: 5 },
      { title: "Me exercitar", desiredWeeklyFrequency: 3 },
      { title: "Meditar", desiredWeeklyFrequency: 1 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalsCompletions).values([
    { goalId: goalsResult[0].id, createdAt: startOfWeek.toDate() },
    {
      goalId: goalsResult[1].id,
      createdAt: startOfWeek.add(1, "day").toDate(),
    },
  ]);
}

seed().finally(() => client.end());
