import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import DATA from "../data";

const Filters = ({ tasks, columnFilters, setColumnFilters, boards }) => {
  const titleFilter = columnFilters.find((f) => f.id === "title")?.value || "";
  const descriptionFilter = columnFilters.find((f) => f.id === "description")?.value || "";
  const [boardIdFilter, setBoardIdFilter] = useState("");

  const onFilterChange = (id, value) =>
    setColumnFilters((prev) =>
      prev
        .filter((f) => f.id !== id)
        .concat({
          id,
          value,
        })
    );

  const onBoardIdFilterChange = (e) => {
    setBoardIdFilter(e.target.value);
    onFilterChange("boardId", e.target.value);
  };

  const boardIdToNameMap = boards.reduce((map, board) => {
    map[board.id] = board.name;
    return map;
  }, {});

  return (
    <div className="flex items-center mb-6">
      <div className="flex items-center">
        <button className="p-1">
          <SearchIcon />
        </button>
        <input
          type="text"
          placeholder="Filter by Task name"
          value={titleFilter}
          onChange={(e) => onFilterChange("title", e.target.value)}
          className="flex-1 rounded bg-white p-1 border border-gray-600"
        />
      </div>
      <div className="flex items-center ml-4">
        <button className="p-1">
          <SearchIcon />
        </button>
        <input
          type="text"
          placeholder="Filter by Description"
          value={descriptionFilter}
          onChange={(e) => onFilterChange("description", e.target.value)}
          className="flex-1 rounded bg-white p-1 border border-gray-600"
        />
      </div>
      <div className="flex items-center ml-4">
        <label htmlFor="boardIdFilter">Board:</label>
        <select
          id="boardIdFilter"
          value={boardIdFilter}
          onChange={onBoardIdFilterChange}
          className="rounded bg-white p-1 ml-2"
        >
          <option value="">All</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.boardId}>
              {boardIdToNameMap[task.boardId]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
