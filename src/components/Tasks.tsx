// TODO

// helper function to capitalize task titles (optional)
// format long task titles
// look at openTaskModal
// style

import { FormEvent, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { AddTaskModal } from "./AddTaskModal";

export const Tasks = () => {
  const taskTitleRef = useRef<HTMLInputElement>(null);
  const estPomosRef = useRef<HTMLInputElement>(null);
  const [focusedTask, setFocusedTask] = useState<any>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tasks, setTasks] = useState([
    {
      title: "important thing ",
      estimatedPomos: 20,
      completedPomos: 0,
      id: nanoid(),
    },
    {
      title: "important stuff",
      estimatedPomos: 5,
      completedPomos: 0,
      id: nanoid(),
    },
    {
      title: "sss",
      estimatedPomos: 2,
      completedPomos: 0,
      id: nanoid(),
    },
  ]);

  function openTaskModal() {
    setShowTaskModal(!showTaskModal);
  }

  function addTask(e: FormEvent) {
    e.preventDefault();

    if (taskTitleRef.current?.value.trim() === "") {
      alert("Please provide a task name");
      return;
    }

    const newTask = {
      title: taskTitleRef.current!.value,
      estimatedPomos: Number(estPomosRef.current!.value),
      completedPomos: 0,
      id: nanoid(),
    };

    tasks.push(newTask);
    setTasks((tasks) => [...tasks]);

    taskTitleRef.current!.value = "";
    estPomosRef.current!.value = "1";
  }

  function focusTask(e: any) {
    const li = e.target.closest("li");

    if (li) {
      const taskId = li.dataset.id;

      setFocusedTask(tasks.find((task) => task.id === taskId));
    }
  }

  return (
    <>
      <div className="mx-auto">
        <h2 className="text-center text-slate-400">
          {focusedTask && focusedTask.title}
        </h2>
        <img
          className="mx-auto mt-4 cursor-pointer"
          src="./add.svg"
          alt="add task"
          onClick={openTaskModal}
        />
      </div>
      <ul
        onClick={focusTask}
        className="border border-4 border-red-500 flex  flex-col gap-4 items-center justify-center text-slate-400"
      >
        {tasks.map((task) => {
          return (
            <li
              key={task.id}
              className="flex w-full justify-between border p-4 cursor-pointer"
              data-id={task.id}
            >
              <p className="max-w-sm break-words">{task.title} </p>
              <p>
                {task.completedPomos} / {task.estimatedPomos}
              </p>
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
