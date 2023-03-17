import { createBrowserRouter } from "react-router-dom";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import MainLayout from "../pages/MainLayout";
import MoviePage from "../pages/MoviePage";
import OnGoingPage from "../pages/OnGoingPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        path: "/",
        element: <Home />,
      },
      {
        path: "movie/:id",
        element: <MoviePage />,
        loader: async ({ params }) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${params.id}?api_key=${import.meta.env.VITE_MOVIE_KEY}&language=vi-VN`
          );
          const data = await res.json();
          if (!data) throw new Error("Not found");
          if (data.video) {
            //If movie has trailer, fetch trailer
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${
                import.meta.env.VITE_MOVIE_KEY
              }&language=vi-VN`
            );
            const video = await res.json();
            data.video = video;
          }
          return data;
        },
      },
      {
        path: "phim-dang-chieu",
        element: <OnGoingPage />,
        loader: async () => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${
              import.meta.env.VITE_MOVIE_KEY
            }&language=vi-VN&page=1`
          );
          const data = await res.json();
          if (!data) throw new Error("Not found");
          return data;
        },
      },
    ],
  },

  {
    path: "checkout",
    element: <Checkout />,
  },
]);
