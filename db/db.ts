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
      name TEXT NOT NULL
    );`
  );

  // Create Microcycles table
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS Microcycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
export const insertMesocycle = async (name: string) => {
  const db = await getDBConnection();
  const statement = await db.prepareAsync(
    `INSERT INTO Mesocycles (name) VALUES (?);`
  );

  try {
    const result = await statement.executeAsync([name]);
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
