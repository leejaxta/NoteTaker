import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <>
      <style>
        {`
          .pagination {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 16px;
          }

          .pagination-icon {
            font-size: 24px;
            cursor: pointer;
            color: #121212;
            transition: color 0.2s ease;
          }

          .pagination-icon.disabled {
            cursor: not-allowed;
            color: #9ca3af; /* greyed out */
          }

          .pagination-icon:not(.disabled):hover {
            color: #2E2E2E; /* hover color */
          }

          .pagination-text {
            font-weight: 500;
          }
        `}
      </style>

      <div className="pagination">
        <FiChevronLeft
          className={`pagination-icon ${page === 1 ? "disabled" : ""}`}
          onClick={() => page > 1 && onPageChange(page - 1)}
        />

        <span className="pagination-text">
          Page {page} of {totalPages}
        </span>

        <FiChevronRight
          className={`pagination-icon ${page === totalPages ? "disabled" : ""}`}
          onClick={() => page < totalPages && onPageChange(page + 1)}
        />
      </div>
    </>
  );
};

export default Pagination;
