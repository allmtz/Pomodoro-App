// TODO

// helper function to capitalize task titles (optional)
// format long task titles
// style
// make a settings context ?
// proper types

import { FormEvent, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { AddTaskModal } from "./AddTaskModal";

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
  collection,
  addDoc,
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

  function deleteTask(e: any) {
    const li = e.target.closest("li");

    if (li) {
      const taskId = li.dataset.id;
      const newTasks = tasks.filter((task: any) => task.taskId != taskId);

      // re-set the focusedTask to null if user deletes the focusedTask
      if (focusedTask && focusedTask.taskId === taskId) {
        setFocusedTask(null);
      }

      setTasks(newTasks);
    }
  }

  return (
    <>
      <div className="mx-auto">
        <h2 className="text-center text-slate-400 h-4">
          {focusedTask ? focusedTask.title : "What's your focus?"}
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
