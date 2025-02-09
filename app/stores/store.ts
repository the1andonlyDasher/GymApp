// store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDBConnection } from "@/db/db";

export interface Mesocycle {
  id: number;
  name: string;
  num_microcycles: number;
}

export interface Microcycle {
  id: number;
  name: string;
  mesocycle_id: number;
  num_workouts: number;
}

export interface Workout {
  id: number;
  name: string;
  microcycle_id: number;
}

export interface Exercise {
  id: number;
  workout_id: number;
  name: string;
}

export interface MesoPreset {
  name: string;
  num_microcycles: number;
}

export interface MicroPreset {
  name: string;
  num_workouts: number;
}

export interface ExercisePreset {
  id: number;
  name: string;
}
export interface WorkoutPreset {
  id: number;
  name: string;
}

export interface Set {
  id: number;
  reps: number;
  weight: number;
  rpe: number;
}

export interface ExerciseSetRow {
  exercise_id: number;
  exercise_name: string;
  set_id: number | null; // Sets might be null if there's no set for an exercise
  set_weight: number | null; // Nullable to handle left joins where no set exists
  set_reps: number | null;
  set_rpe: number | null;
}

export type ExerciseWithSets = Exercise & { setsDetails: Set[] };

interface ItemStore {
  mesocycles: Mesocycle[];
  microcycles: Microcycle[];
  workouts: Workout[];
  exercises: Exercise[];
  exercisePresets: ExercisePreset[];
  workoutPresets: WorkoutPreset[];
  mesocyclePresets: MesoPreset[];
  loadMesoPresets: () => Promise<void>;
  addMesoPreset: (
    mesocycle: Pick<Mesocycle, "name" | "num_microcycles">
  ) => Promise<void>;
  microcyclePresets: MicroPreset[];
  loadMicroPresets: () => Promise<void>;
  addMicroPreset: (
    microcycle: Pick<Microcycle, "name" | "num_workouts">
  ) => Promise<void>;
  loadExercisePresets: () => Promise<void>;
  loadWorkoutPresets: () => Promise<void>;
  sets: Set[];
  exercisesWithSets: ExerciseWithSets[];
  loadMesocycles: () => Promise<void>;
  deleteMesocycle: (id: number) => Promise<void>;
  addMesocycle: (
    mesocycle: Pick<Mesocycle, "name" | "num_microcycles">
  ) => Promise<void>;
  loadMicrocycles: (mesocycle_id: number) => Promise<void>;
  deleteMicrocycle: (id: number) => Promise<void>;
  addMicrocycle: (
    mesocycle_id: number,
    name: string,
    num_workouts: number
  ) => Promise<void>;
  addWorkout: (microcycle_id: number, name: string) => Promise<void>;
  deleteWorkout: (id: number) => Promise<void>;
  loadWorkouts: (microcycle_id: number) => Promise<void>;
  addExercise: (workout_id: number, name: string) => Promise<void>;
  deleteExercise: (id: number) => Promise<void>;
  loadExercises: (workout_id: number) => Promise<void>;
  addSet: (
    exercise_id: number,
    reps: number,
    weight: number,
    rpe: number
  ) => Promise<void>;
  loadSets: (exercise_id: number) => Promise<void>;
  deleteSet: (id: number) => Promise<void>;
  loadSetsAndExercises: (workout_id: number) => Promise<void>;
  updateMicrocycle: (id: number) => Promise<void>;
}

const useItemStore = create<ItemStore>()(
  persist(
    (set, get) => ({
      mesocycles: [],
      microcycles: [],
      workouts: [],
      exercises: [],
      exercisePresets: [],
      workoutPresets: [],
      loadWorkoutPresets: async () => {
        const db = await getDBConnection();
        const workoutPresets = await db.getAllAsync<WorkoutPreset>(
          "SELECT * FROM Workout_Presets"
        );
        set({ workoutPresets: workoutPresets });
      },
      loadExercisePresets: async () => {
        const db = await getDBConnection();
        const exercisePresets = await db.getAllAsync<ExercisePreset>(
          "SELECT * FROM Exercise_Presets"
        );
        set({ exercisePresets: exercisePresets });
      },
      mesocyclePresets: [],
      loadMesoPresets: async () => {
        const db = await getDBConnection();
        const mesocyclePresets = await db.getAllAsync<MesoPreset>(
          "SELECT * FROM Mesocycle_Presets"
        );
        set({ mesocyclePresets: mesocyclePresets });
      },
      addMesoPreset: async (mesocycle) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "INSERT INTO Mesocycle_Presets ( name, num_microcycles) VALUES ( $name, $num_microcycles)"
        );

        try {
          const result = await statement.executeAsync({
            $name: mesocycle.name,
            $num_microcycles: mesocycle.num_microcycles,
          });
          if (result) {
            const id = result.lastInsertRowId;
            set((state) => ({
              mesocyclePresets: [
                { ...mesocycle, id: id },
                ...state.mesocyclePresets,
              ],
            }));
          }
        } catch (error) {
          console.error("Error adding microcycle:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      microcyclePresets: [],
      loadMicroPresets: async () => {
        const db = await getDBConnection();
        const microcyclePresets = await db.getAllAsync<MicroPreset>(
          "SELECT * FROM Microcycle_Presets"
        );
        set({ microcyclePresets: microcyclePresets });
      },
      addMicroPreset: async (microcycle) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "INSERT INTO Microcycle_Presets (id, name, num_workouts) VALUES ($id, $name, $num_workouts)"
        );

        try {
          const result = await statement.executeAsync({
            $name: microcycle.name,
            $num_workouts: microcycle.num_workouts,
          });
          if (result) {
            set((state) => ({
              microcyclePresets: [microcycle, ...state.microcyclePresets],
            }));
          }
        } catch (error) {
          console.error("Error adding microcycle preset:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      sets: [],
      exercisesWithSets: [],
      loadMesocycles: async () => {
        const db = await getDBConnection();
        const mesocycles = await db.getAllAsync<Mesocycle>(
          "SELECT * FROM Mesocycles"
        );
        set({ mesocycles: mesocycles });
      },
      addMesocycle: async (mesocycle) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          `INSERT INTO Mesocycles ( name, num_microcycles) VALUES ( ?, ? );`
        );
        try {
          const result = await statement.executeAsync([
            mesocycle.name,
            mesocycle.num_microcycles,
          ]);
          console.log("Inserted Mesocycle with ID:", result.lastInsertRowId);
          if (result.lastInsertRowId) {
            set((state) => ({
              mesocycles: [
                ...state.mesocycles,
                { ...mesocycle, id: result.lastInsertRowId },
              ],
            }));
          }
        } catch (error) {
          console.log(error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      deleteMesocycle: async (id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "DELETE FROM Mesocycles WHERE id = $id"
        );
        try {
          let result = await statement.executeAsync({ $id: id });
          console.log(
            "Deleted mesocycle with ID:",
            id,
            "Changes:",
            result.changes,
            result.lastInsertRowId
          );
          if (result.changes > 0) {
            // Update Zustand state if the delete was successful
            set((state) => ({
              mesocycles: state.mesocycles.filter((m) => m.id !== id),
            }));
          } else {
            console.warn(`No mesocycle found with ID: ${id}`);
          }
        } catch (error) {
          console.log(error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      loadMicrocycles: async (mesocycle_id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "SELECT * FROM Microcycles WHERE mesocycle_id = $mesocycle_id"
        );
        try {
          const result = await statement.executeAsync<Microcycle>({
            $mesocycle_id: mesocycle_id,
          });
          const microcycles = await result.getAllAsync();
          set({
            microcycles: microcycles,
          });
        } catch (error) {
          console.log(error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      addMicrocycle: async (
        mesocycle_id: number,
        name: string,
        num_workouts: number
      ) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "INSERT INTO Microcycles (mesocycle_id, name) VALUES ($mesocycle_id, $name)"
        );

        try {
          const result = await statement.executeAsync({
            $mesocycle_id: mesocycle_id,
            $name: name,
          });
          set((state) => ({
            microcycles: [
              ...state.microcycles,
              { id: result.lastInsertRowId, mesocycle_id, name, num_workouts },
            ],
          }));
        } catch (error) {
          console.error("Error adding microcycle:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      deleteMicrocycle: async (id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "DELETE FROM Microcycles WHERE id = $id"
        );

        try {
          const result = await statement.executeAsync({ $id: id });
          if (result.changes > 0) {
            set((state) => ({
              microcycles: state.microcycles.filter((m) => m.id !== id),
            }));
          }
        } catch (error) {
          console.error("Error deleting microcycle:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      // Add a new workout to a microcycle
      addWorkout: async (microcycle_id: number, name: string) => {
        const db = await getDBConnection();
        const addWorkoutStatement = await db.prepareAsync(
          "INSERT INTO Workouts (microcycle_id, name) VALUES ($microcycle_id, $name)"
        );
        try {
          const addWorkoutResult = await addWorkoutStatement.executeAsync({
            $microcycle_id: microcycle_id,
            $name: name,
          });

          set((state) => ({
            workouts: [
              ...state.workouts,
              {
                id: addWorkoutResult.lastInsertRowId,
                microcycle_id,
                name,
              },
            ],
          }));
          await addWorkoutStatement.finalizeAsync();
        } catch (error) {
          console.error("Error updating microcycle:", error);
        }
      },
      updateMicrocycle: async (id: number) => {
        const db = await getDBConnection();
        const result = await db.getFirstAsync<Microcycle>(
          "SELECT num_workouts FROM Microcycles WHERE id = $id",
          { $id: id }
        );

        const currentNumWorkouts = result?.num_workouts ?? 0;
        console.log(currentNumWorkouts);
        const updateMicroStatement = await db.prepareAsync(
          "UPDATE Microcycles SET num_workouts = $num_workouts WHERE id = $id"
        );
        try {
          await updateMicroStatement.executeAsync({
            $id: id,
            $num_workouts: currentNumWorkouts + 1,
          });
          await updateMicroStatement.finalizeAsync();
        } catch (error) {
          console.error("Error updating microcycle:", error);
        }
      },
      // Retrieve all workouts within a specific microcycle
      loadWorkouts: async (microcycle_id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "SELECT * FROM Workouts WHERE microcycle_id = $microcycle_id"
        );

        try {
          const result = await statement.executeAsync<Workout>({
            $microcycle_id: microcycle_id,
          });
          const workouts = await result.getAllAsync();
          set({ workouts: workouts });
        } catch (error) {
          console.error("Error loading workouts:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      // Delete a workout by ID
      deleteWorkout: async (id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "DELETE FROM Workouts WHERE id = $id"
        );

        try {
          const result = await statement.executeAsync({ $id: id });
          if (result.changes > 0) {
            set((state) => ({
              workouts: state.workouts.filter((w) => w.id !== id),
            }));
          }
        } catch (error) {
          console.error("Error deleting workout:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      // Add a new exercise to a workout
      addExercise: async (workout_id: number, name: string) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "INSERT INTO Exercises (workout_id, name) VALUES ($workout_id, $name)"
        );

        try {
          const result = await statement.executeAsync({
            $workout_id: workout_id,
            $name: name,
          });
          set((state) => ({
            exercises: [
              ...state.exercises,
              {
                id: result.lastInsertRowId,
                workout_id,
                name,
              },
            ],
          }));
        } catch (error) {
          console.error("Error adding exercise:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },

      // Retrieve all exercises for a specific workout
      loadExercises: async (workout_id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "SELECT * FROM Exercises WHERE workout_id = $workout_id"
        );

        try {
          const result = await statement.executeAsync<Exercise>({
            $workout_id: workout_id,
          });
          const exercises = await result.getAllAsync();
          set({ exercises: exercises });
        } catch (error) {
          console.error("Error loading exercises:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },

      // Delete an exercise by ID
      deleteExercise: async (id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "DELETE FROM Exercises WHERE id = $id"
        );

        try {
          const result = await statement.executeAsync({ $id: id });
          if (result.changes > 0) {
            set((state) => ({
              exercises: state.exercises.filter((e) => e.id !== id),
            }));
          }
        } catch (error) {
          console.error("Error deleting exercise:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      // Add a new set to a workout
      addSet: async (
        exercise_id: number,
        reps: number,
        weight: number,
        rpe: number
      ) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "INSERT INTO Sets (exercise_id, reps, weight, rpe) VALUES ($exercise_id,  $reps, $weight, $rpe)"
        );

        try {
          const result = await statement.executeAsync({
            $exercise_id: exercise_id,
            $reps: reps,
            $weight: weight,
            $rpe: rpe,
          });
          set((state) => ({
            sets: [
              ...state.sets,
              {
                id: result.lastInsertRowId,
                exercise_id,
                reps,
                weight,
                rpe,
              },
            ],
          }));
        } catch (error) {
          console.error("Error adding exercise:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      loadSets: async (exercise_id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "SELECT * FROM Sets WHERE exercise_id = $exercise_id"
        );

        try {
          const result = await statement.executeAsync<Set>({
            $exercise_id: exercise_id,
          });
          const sets = await result.getAllAsync();
          set({ sets: sets });
        } catch (error) {
          console.error("Error loading exercises:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      deleteSet: async (id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          "DELETE FROM Sets WHERE id = $id"
        );

        try {
          const result = await statement.executeAsync({ $id: id });
          if (result.changes > 0) {
            set((state) => ({
              sets: state.sets.filter((e) => e.id !== id),
            }));
          }
        } catch (error) {
          console.error("Error deleting exercise:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
      loadSetsAndExercises: async (workout_id: number) => {
        const db = await getDBConnection();
        const statement = await db.prepareAsync(
          `SELECT 
      Exercises.id AS exercise_id,
      Exercises.name AS exercise_name,
      Sets.id AS set_id,
      Sets.weight AS set_weight,
      Sets.reps AS set_reps,
      Sets.rpe AS set_rpe
    FROM 
      Exercises
    LEFT JOIN 
      Sets ON Exercises.id = Sets.exercise_id
    WHERE 
      Exercises.workout_id = $workout_id;`
        );

        try {
          // Execute the query and retrieve rows
          const result = await statement.executeAsync({
            $workout_id: workout_id,
          });
          const rows = (await result.getAllAsync()) as ExerciseSetRow[];

          const exercises: ExerciseWithSets[] = [];

          for (const row of rows) {
            // Find or create the exercise entry
            let exercise = exercises.find((e) => e.id === row.exercise_id);
            if (!exercise) {
              // Initialize a new exercise if it doesn't exist in the list
              exercise = {
                id: row.exercise_id,
                workout_id: workout_id,
                name: row.exercise_name,
                setsDetails: [],
              };
              exercises.push(exercise);
            }

            // Add set details to the exercise's setsDetails array if there is a set
            if (row.set_id) {
              exercise.setsDetails.push({
                id: row.set_id,
                weight: row.set_weight as number,
                reps: row.set_reps as number,
                rpe: row.set_rpe as number,
              });
            }
          }

          // Update Zustand state with the newly loaded exercises and sets
          set({ exercisesWithSets: exercises });
        } catch (error) {
          console.error("Error loading sets and exercises:", error);
        } finally {
          await statement.finalizeAsync();
        }
      },
    }),
    {
      name: "item-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useItemStore;
