import { FaUsers } from "react-icons/fa";
import { MdMovieFilter } from "react-icons/md";
import { Link } from "react-router-dom";

type Props = {};

function Dashboard({}: Props) {
  return (
    <div className="mx-auto container grid place-items-center min-h-screen">
      <div className="gap-5 text-lg px-5 flex">
        <Link to={"employee"}>
          <button className="btn btn-primary btn-outline gap-2">
            <FaUsers /> <span>Quản lý nhân viên</span>
          </button>
        </Link>

        <Link to={"movie"}>
          <button className="btn btn-primary btn-outline gap-2">
            <MdMovieFilter /> <span>Quản lý Phim</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
