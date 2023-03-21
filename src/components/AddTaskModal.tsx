// TODO
// proper types

export const AddTaskModal = ({
  setShowTaskModal,
  taskTitleRef,
  estPomosRef,
  addTask,
}: any) => {
  return (
    <form className="flex flex-col text-gray-500 border p-4">
      <div
        className="cursor-pointer ml-auto"
        onClick={() => setShowTaskModal(false)}
      >
        X
      </div>
      <label htmlFor="task-title">What's next?</label>
      <input id="task-title" ref={taskTitleRef} />
      <label htmlFor="estimated-pomos">Estimated Pomodoros?</label>
      <input
        type="number"
        min="0"
        step="1"
        defaultValue="1"
        id="estimated-pomos"
        ref={estPomosRef}
      />
      <button onClick={addTask}>Add Task</button>
    </form>
  );
};
