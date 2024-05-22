import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const Filters = ({ tasks, columnFilters, setColumnFilters, boards }) => {
  const titleFilter = columnFilters.find((f) => f.id === "title")?.value || "";
  const descriptionFilter = columnFilters.find((f) => f.id === "description")?.value || "";
  const [boardIdFilter, setBoardIdFilter] = useState("");

  const getBoardName = (boardId) => {
    const board = boards.find((b) => b.id === boardId);
    return board ? board.name : "Unknown";
  };

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
    const boardName = getBoardName(e.target.value);
    setBoardIdFilter(boardName);
    onFilterChange("boardId", boardIdFilter);
  };

  return (
    <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <SearchIcon />
        <input
          type="text"
          placeholder="Task name"
          value={titleFilter}
          onChange={(e) => onFilterChange("title", e.target.value)}
          className="flex-1 rounded bg-white p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <SearchIcon />
        <input
          type="text"
          placeholder="Description"
          value={descriptionFilter}
          onChange={(e) => onFilterChange("description", e.target.value)}
          className="flex-1 rounded bg-white p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="boardIdFilter" className="font-medium text-gray-700">Board:</label>
        <select
          id="boardIdFilter"
          value={boardIdFilter}
          onChange={onBoardIdFilterChange}
          className="rounded bg-white p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
