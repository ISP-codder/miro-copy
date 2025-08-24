import { rqClient } from "@/shared/api/instance";
import { CONFIG } from "@/shared/model/config";
import { ROUTES } from "@/shared/model/routes";
import { href, Link } from "react-router-dom";

function BoardsListPage() {
  const boardsQuery = rqClient.useQuery("get", "/boards");

  return (
    <div>
      <h1>Boards List {CONFIG.API_BASE_URL}</h1>
      {boardsQuery.data?.map((board) => (
        <Link to={href(ROUTES.BOARD, { boardId: board.id })}>{board.name}</Link>
      ))}
    </div>
  );
}

export const Component = BoardsListPage;
