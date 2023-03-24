// TODO

// format long task titles
// style
// proper types

import { FormEvent, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { AddTaskModal } from "./AddTaskModal";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

const taskStyling = {
  default:
    "flex w-full justify-between  rounded-md bg-dark-bg p-4 cursor-pointer border-l-4 border-transparent",
  focused:
    "flex w-full justify-between rounded-md bg-dark-bg p-4 cursor-pointer border-l-4 border-green-400",
};

export const Tasks = ({
  tasks,
  setTasks,
  focusedTask,
  setFocusedTask,
  children,
  db,
  auth,
}: any) => {
  const taskTitleRef = useRef<HTMLInputElement>(null);
  const estPomosRef = useRef<HTMLInputElement>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  function openTaskModal() {
    setShowTaskModal(true);
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();

    if (taskTitleRef.current?.value.trim() === "") {
      alert("Please provide a task name");
      return;
    }

    const newTask = {
      title: taskTitleRef.current!.value,
      estimatedPomos: Number(estPomosRef.current!.value),
      completedPomos: 0,
      taskId: nanoid(),
      dateCreated: new Date(),
    };

    tasks.push(newTask);
    setTasks((tasks: any) => [...tasks]);

    taskTitleRef.current!.value = "";
    estPomosRef.current!.value = "1";
    setShowTaskModal(false);
    setFocusedTask(newTask);

    // if a user is signed in add the created task to the `tasks` collection
    if (auth.currentUser) {
      try {
        const docRef = await addDoc(collection(db, "tasks"), {
          ...newTask,
          uid: auth.currentUser.uid,
        });
        // console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        // console.error("Error adding document: ", e);
      }
    }
  }

  function focusTask(e: any) {
    // do nothing if the user clicks on the delete button
    if (e.target.className.includes("delete-btn")) return;

    const li = e.target.closest("li");

    if (li) {
      const taskId = li.dataset.id;

      setFocusedTask(tasks.find((task: any) => task.taskId === taskId));
    }
  }

  async function deleteTask(e: any) {
    const li = e.target.closest("li");

    if (li) {
      const taskId = li.dataset.id;

      // filter out the clicked task from `tasks`
      const newTasks = tasks.filter((task: any) => task.taskId != taskId);

      setTasks(newTasks);
      if (focusedTask && focusedTask.taskId === taskId) {
        // re-set the focusedTask to null if user deletes the focusedTask
        setFocusedTask(null);
      }

      // if a user is signed in, delete the task document from db
      if (auth.currentUser) {
        const tasksRef = collection(db, "tasks");

        const q = query(tasksRef, where("taskId", "==", `${taskId}`));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          deleteDoc(doc.ref);
        });
      }
    }
  }

  return (
    <>
      <div className="mx-auto">
        <h2 className="text-center text-slate-400 h-4">
          {focusedTask ? focusedTask.title : "What are you focusing on?"}
        </h2>
        <div className="mt-8 flex items-center gap-6 justify-center">
          <img
            className="cursor-pointer"
            src="./add.svg"
            alt="add task"
            onClick={openTaskModal}
          />
          {children}
        </div>
      </div>
      <ul
        onClick={focusTask}
        className="flex flex-col gap-4 items-center justify-center text-slate-400"
      >
        {tasks.map((task: any) => {
          return (
            <li
              key={task.taskId}
              className={
                focusedTask
                  ? focusedTask.taskId === task.taskId
                    ? taskStyling.focused
                    : taskStyling.default
                  : taskStyling.default
              }
              data-id={task.taskId}
            >
              <p className="max-w-sm break-words">{task.title} </p>
              <div className="flex gap-4">
                <p>
                  {task.completedPomos} / {task.estimatedPomos}
                </p>
                <p
                  className="delete-btn cursor-pointer p-[2px] hover:text-red-400"
                  onClick={deleteTask}
                >
                  X
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {showTaskModal && (
        <AddTaskModal
          setShowTaskModal={setShowTaskModal}
          taskTitleRef={taskTitleRef}
          estPomosRef={estPomosRef}
          addTask={addTask}
        />
      )}
    </>
  );
};
