import { useState, useContext } from "react";
import { Droppable } from "react-beautiful-dnd";

import AddItem from "./AddItem";
import AddItemForm from "./AddItemForm";

import { BsThreeDots } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { MdDelete, MdDriveFileMove } from "react-icons/md";
import { BoardContext } from "../contexts/Board";
import { ListContext } from "../contexts/List";
import { TaskContext } from "../contexts/Task";
import TaskCard from "./TaskCard";

const TaskList = ({ taskList, index }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [listTitle, setListTitle] = useState(taskList.title);
  const [editMode, setEditMode] = useState(false);
  const [editList, setEditList] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState("");

  const { tasks: allTasks, dispatchTaskAction } = useContext(TaskContext);
  const { dispatchListAction } = useContext(ListContext);
  const { boards, dispatchBoardAction } = useContext(BoardContext);

  const submitHandler = (e) => {
    e.preventDefault();
    const id = Date.now() + "";

    dispatchTaskAction({
      type: "CREATE_TASK",
      payload: {
        id: id,
        title: taskTitle,
        listId: taskList.id,
        boardId: taskList.boardId,
      },
    });

    dispatchListAction({
      type: "ADD_TASK_ID_TO_A_LIST",
      payload: { id: taskList.id, taskId: id },
    });
    dispatchBoardAction({
      type: "ADD_TASK_ID_TO_A_BOARD",
      payload: { id: taskList.boardId, taskId: id },
    });

    setEditMode(false);
    setTaskTitle("");
  };

  const editListHandler = (e) => {
    e.preventDefault();
    dispatchListAction({
      type: "UPDATE_LIST",
      payload: { id: taskList.id, title: listTitle },
    });

    setEditList(false);
  };

  console.log(showMenu);

  const removeListHandler = () => {
    dispatchListAction({ type: "REMOVE_LIST", payload: taskList.id });
    dispatchBoardAction({
      type: "REMOVE_LIST_ID_FROM_BOARD",
      payload: { id: taskList.boardId, listId: taskList.id },
    });
  };
  const moveHandler = (e) => {
    e.preventDefault();
    let taskIds = taskList.tasks.map((item) => item);
    if (!selectedBoardId) {
      return alert("Please select a board  to move the list");
    }
    if (selectedBoardId === taskList.boardId) {
      return alert("You can't move the list to the same board ");
    } else if (taskList.boardId !== selectedBoardId) {
      dispatchBoardAction({
        type: "REMOVE_LIST_ID_FROM_BOARD",
        payload: { id: taskList.boardId, listId: taskList.id },
      });

      dispatchBoardAction({
        type: "ADD_LIST_ID_TO_A_BOARD",
        payload: { id: selectedBoardId, listId: taskList.id },
      });

      dispatchListAction({
        type: "CHANGE_BOARD_ID_OF_A_LIST",
        payload: { id: taskList.id, boardId: selectedBoardId },
      });
      taskIds.map((item) => {
        dispatchBoardAction({
          type: "REMOVE_TASK_ID_FROM_A_BOARD",
          payload: {
            id: taskList.boardId,
            taskId: item,
          },
        });
        dispatchBoardAction({
          type: "ADD_TASK_ID_TO_A_BOARD",
          payload: {
            id: selectedBoardId,
            taskId: item,
          },
        });
        dispatchTaskAction({
          type: "CHANGE_BOARD_ID_OF_A_TASK",
          payload: { id: item, boardId: selectedBoardId },
        });
      });
    }
  };
  return (
    <Droppable droppableId={taskList.id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {!editList ? (
            <div className="list-container">
              <div className="list-title-container">
                <h5>{taskList.title}</h5>
                <BsThreeDots
                  className="icons"
                  onClick={() => setShowMenu(!showMenu)}
                />
              </div>

              {showMenu && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <BiEdit className="icons" onClick={() => setEditList(true)}>
                      Edit
                    </BiEdit>
                    <MdDriveFileMove
                      className="icons"
                      onClick={() => setShowBoard(!showBoard)}
                    >
                      Move
                    </MdDriveFileMove>

                    <MdDelete className="icons" onClick={removeListHandler}>
                      Delete
                    </MdDelete>
                  </div>
                  <div>
                    {showBoard && (
                      <div className="board">
                        <h3>Move List</h3>

                        <form onSubmit={(e) => moveHandler(e)}>
                          <select
                            name=""
                            id=""
                            onChange={(e) => setSelectedBoardId(e.target.value)}
                          >
                            <option value="">Select Board</option>
                            {boards.map((board) => (
                              <option key={board.id} value={board.id}>
                                {board.title}
                              </option>
                            ))}
                          </select>

                          <button type="submit">Move List</button>
                        </form>
                      </div>
                    )}
                  </div>
                </>
              )}

              {taskList.tasks
                .map((item) => {
                  return allTasks.find((i) => i.id === item);
                })
                .map((task, index) => (
                  <TaskCard index={index} task={task} key={task.id} />
                ))}
              {provided.placeholder}

              {!editMode ? (
                <AddItem setEditMode={setEditMode} />
              ) : (
                <AddItemForm
                  title={taskTitle}
                  onChangeHandler={(e) => setTaskTitle(e.target.value)}
                  setEditMode={setEditMode}
                  editMode={editMode}
                  submitHandler={submitHandler}
                />
              )}
            </div>
          ) : (
            <AddItemForm
              title={listTitle}
              onChangeHandler={(e) => setListTitle(e.target.value)}
              setEditMode={setEditList}
              submitHandler={editListHandler}
            />
          )}
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
