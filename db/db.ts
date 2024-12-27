import { Mesocycle } from "@/app/stores/store";
import * as SQLite from "expo-sqlite";

export const getDBConnection = async () => {
  const db = await SQLite.openDatabaseAsync("myDatabase", {
    useNewConnection: true,
  });
  return db;
};

export const createTables = async () => {
  const db = await getDBConnection();

  // Create Mesocycles table
  await db.execAsync(
    `
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Mesocycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      num_microcycles INTEGER,
      name TEXT NOT NULL
    );`
  );

  // Create Microcycles table
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS Microcycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      num_workouts INTEGER,
      mesocycle_id INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY (mesocycle_id) REFERENCES Mesocycles(id)
    );`
  );

  // Create Workouts table
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS Workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      microcycle_id INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY (microcycle_id) REFERENCES Microcycles(id)
    );`
  );

  // Create Exercises table
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS Exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER,
      name TEXT NOT NULL,
      sets INTEGER,
      weight REAL,
      reps INTEGER,
      rpe REAL,
      FOREIGN KEY (workout_id) REFERENCES Workouts(id)
    );`
  );

  // Create Mesocycle_Presets table
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS Mesocycle_Presets (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL UNIQUE
       num_microcycles INTEGER NOT NULL
    );`
  );

  // Create Exercise_Presets table
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS Exercise_Presets (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL UNIQUE
    );`
  );

  // Insert exercises into Exercise_Presets
  const exercises = [
    "Front Squats",
    "Romanian Deadlift",
    "Seated Leg Curls",
    "Single Leg Press",
    "Standing Calf Raises",
    "Donkey Calf Raises",
    "Incline Bench Press",
    "Dumbell Rows",
    "Chest Press Machine",
    "High Row",
    "Chest Fly Machine",
    "T Bar Rows",
    "Scott Curl Machine",
    "Skull Crushers/Pullovers",
    "Cable Side Raises",
    "Cable Reverse Flies",
    "Incline Dumbell Curls",
    "Cable Overhead Triceps Extensions",
  ];

  await db.execAsync(
    `DELETE FROM Exercise_Presets
     WHERE id NOT IN (
         SELECT MIN(id)
         FROM Exercise_Presets
         GROUP BY name
     );`
  );

  for (const exercise of exercises) {
    const statement = await db.prepareAsync(
      `INSERT OR IGNORE INTO Exercise_Presets (name) VALUES ($value);`
    );

    try {
      const result = await statement.executeAsync([exercise]);
      console.log(result);
      return result.lastInsertRowId;
    } catch (error) {
      console.error("Error adding exercise:", error);
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Create Sets table
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS Sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER,
      weight REAL,
      reps INTEGER,
      rpe REAL,
      FOREIGN KEY (exercise_id) REFERENCES Exercises(id)
    );`
  );
};

export const resetDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("myDatabase");
  await db.execAsync(`DROP TABLE IF EXISTS test`);
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER)`
  );
  // await createTable(db);
};

//create a new mesocycle
export const insertMesocycle = async (mesocycle: Mesocycle) => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO Mesocycles (id, name, num_microcycles) VALUES (?, ?, ? );`
  );

  try {
    const result = await statement.executeAsync([
      mesocycle.id,
      mesocycle.name,
      mesocycle.num_microcycles,
    ]);
    console.log("Inserted Mesocycle with ID:", result.lastInsertRowId);
    return result.lastInsertRowId; // Return the ID to use in Microcycles
  } finally {
    await statement.finalizeAsync();
  }
};

export const insertMicrocycle = async (mesocycleId: number, name: string) => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO Microcycles (mesocycle_id, name) VALUES (?, ?);`
  );

  try {
    const result = await statement.executeAsync([mesocycleId, name]);
    console.log("Inserted Microcycle with ID:", result.lastInsertRowId);
    return result.lastInsertRowId; // Return the ID to use in Workouts
  } finally {
    await statement.finalizeAsync();
  }
};

export const insertWorkout = async (microcycleId: number, name: string) => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO Workouts (microcycle_id, name) VALUES (?, ?);`
  );

  try {
    const result = await statement.executeAsync([microcycleId, name]);
    console.log("Inserted Workout with ID:", result.lastInsertRowId);
    return result.lastInsertRowId; // Return the ID to use in Exercises
  } finally {
    await statement.finalizeAsync();
  }
};

export const insertExercise = async (
  workoutId: number,
  name: string,
  sets: number,
  weight: number,
  reps: number,
  rpe: number
) => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO Exercises (workout_id, name, sets, weight, reps, rpe) VALUES (?, ?, ?, ?, ?, ?);`
  );

  try {
    const result = await statement.executeAsync([
      workoutId,
      name,
      sets,
      weight,
      reps,
      rpe,
    ]);
    console.log("Inserted Exercise with ID:", result.lastInsertRowId);
  } finally {
    await statement.finalizeAsync();
  }
};
