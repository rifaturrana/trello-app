export const boardReducer = (boards, action) => {
  switch (action.type) {
    case "CREATE_BOARD": {
      const board = {
        id: Date.now() + "",
        title: action.payload,
        lists: [],
        tasks: [],
        createdAt:
          new Date().getUTCDate() +
          "/" +
          new Date().getUTCMonth() +
          1 +
          "/" +
          new Date().getUTCFullYear(),
      };

      return [...boards, board];
    }

    case "REMOVE_BOARD": {
      return boards.filter((item) => item.id !== action.payload);
    }

    case "ADD_LIST_ID_TO_A_BOARD": {
      return boards.map((item) => {
        if (item.id === action.payload.id) {
          item.lists.push(action.payload.listId);
        }

        return item;
      });

      // return newState
    }

    case "ADD_TASK_ID_TO_A_BOARD": {
      return boards.map((item) => {
        if (item.id === action.payload.id) {
          item.tasks.push(action.payload.taskId);
        }

        return item;
      });
    }

    case "UPDATE_BOARD": {
      return boards.map((item) => {
        if (item.id === action.payload.id) {
          item.title = action.payload.title;
        }

        return item;
      });
    }

    case "REMOVE_LIST_ID_FROM_BOARD": {
      return boards.map((item) => {
        if (item.id === action.payload.id) {
          const newListIds = item.lists.filter(
            (listId) => listId !== action.payload.listId
          );
          item.lists = newListIds;
        }

        return item;
      });
    }

    case "REMOVE_TASK_ID_FROM_A_BOARD": {
      return boards.map((item) => {
        if (item.id === action.payload.id) {
          const newTaskIds = item.tasks.filter(
            (listId) => listId !== action.payload.taskId
          );
          item.tasks = newTaskIds;
          console.log(item.tasks, "Removed");
        }

        return item;
      });
    }

    default:
      return boards;
  }
};

/**
 * boards = [
 *      {
 *          id: '1',
 *          title: 'Board 1',
 *          lists: ["list-1", "list-2", "list-3"],
 *          tasks: ["task-1", "task-2"],
 *
 *       },
 *
 *        {
 *          id: '2',
 *          title: 'Board 1',
 *          lists: ["list-1", "list-2"],
 *          tasks: ["task-1", "task-2"],
 *
 *       },
 *
 * ]
 */

// action = {type: 'CREATE', payload: {id: '1', title: 'board1'}}
