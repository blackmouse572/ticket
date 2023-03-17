import * as Separator from "@radix-ui/react-separator";
import { useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { MdNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "../components/DatePicker";
import SeatMap from "../components/SeatMap";
import ShowTimePicker from "../components/ShowTimePicker";
import { Movie, MovieResponse } from "../entity/Movie";
import { Seat, SeatMap as SeatMapEntity } from "../entity/Seat";
import { CheckoutFormProps } from "./Checkout";

const seats = Array.from({ length: 5 }, (_, i) => {
  return Array.from({ length: 5 }, (_, j) => {
    const row = String.fromCharCode(65 + i);
    const column = j + 1;
    const id = row + column;
    const isTaken = Math.random() > 0.5;
    const seat: Seat = {
      id: id.toString() as string,
      row: row,
      column: column,
      reserved: isTaken,
    };

    return seat;
  });
});

const datas: SeatMapEntity = {
  rows: 5,
  columns: 5,
  seats: seats.flat(),
  total: 25,
};

function OnGoingPage() {
  const data = useLoaderData() as MovieResponse;
  let [searchParams, setSearchParams] = useSearchParams();
  const movieId = searchParams.get("movieId");

  const [movie, setMovie] = useState<Movie | null>(data.results.find((item) => item.id === Number(movieId)) as Movie);
  const sliderRef = useRef<HTMLDivElement>(null);

  function handleNext() {
    //Scroll to next
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        // to right 1 screen
        left: 180 * 6 + 10,
        behavior: "smooth",
      });
    }
  }

  function handlePrev() {
    //Scroll to prev
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -180 * 6 - 10,
        behavior: "smooth",
      });
    }
  }

  function selectMovie(movieId: string) {
    setSearchParams({ movieId });
    setMovie(data.results.find((item) => item.id === Number(movieId)) as Movie);
  }

  return (
    <div className="px-4 relative flex flex-col w-full">
      <section className="overflow-hidden flex gap-3 relative" ref={sliderRef}>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2  translate-y-1/2 z-10 text-3xl bg-gray-600 rounded-full "
        >
          <MdNavigateNext />
        </button>
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 translate-y-1/2 z-10 text-3xl bg-gray-600 rounded-full "
        >
          <MdOutlineNavigateBefore />
        </button>
        {data &&
          data.results.map((item: Movie, index: number) => (
            <div
              onClick={() => {
                selectMovie(item.id.toString());
              }}
              className={`card bg-base-100 group shadow-xl w-full overflow-clip min-w-[10rem] min-h-full transition-all duration-100 cursor-pointer
              ${movie?.id === item.id ? "border-2 border-blue-500" : "border-2 border-transparent"}
            `}
              key={item.id}
            >
              <figure className="w-full overflow-clip">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  className={"w-full group-hover:scale-110 transition-transform duration-300"}
                  key={item.id}
                  height={500}
                  alt={item.title}
                  loading="lazy"
                  width={300}
                />
              </figure>
              <div className="card-body px-2 py-3 text-center justify-center">
                <h2 className="card-title text-lg mx-auto">{item.title}</h2>
              </div>
            </div>
          ))}
      </section>
      <Separator.Root className="bg-base-content data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-6 rounded-full" />
      {movie && <SeletedSeats movies={data} movie={movie} />}
    </div>
  );
}

function SeletedSeats({ movies, movie }: { movies: MovieResponse; movie: Movie }) {
  const [chosenSeats, setChosenSeats] = useState<Seat[]>([]);
  const [time, setTime] = useState("10:00");

  const seatToggle = (seat: Seat) => {
    if (chosenSeats.find((item) => item.id === seat.id)) {
      setChosenSeats(chosenSeats.filter((item) => item.id !== seat.id));
    } else {
      setChosenSeats([...chosenSeats, seat]);
    }
  };

  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  function handleDateChange(date: Date) {
    setDate(date);
  }
  function selectAll() {
    //Select all seats that are not reserved
    setChosenSeats(datas.seats.filter((item) => item.reserved));
  }
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data: CheckoutFormProps = {
      movie,
      seats: chosenSeats,
      showTime: time,
      date,
    };
    navigate(`/checkout`, {
      state: data,
    });
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-12 min-h-screen">
        {/* Selected Movie */}

        <article className="col-span-4 flex justify-center items-center flex-col px-24">
          <div className=" bg-base-100 shadow-xl w-full overflow-clip min-w-[5rem] min-h-fit max-w-[10rem] mx-auto">
            <figure className="w-full overflow-clip">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className={"w-full group-hover:scale-110 transition-transform duration-300"}
                key={movie.id}
                height={500}
                alt={movie.title}
                loading="lazy"
                width={300}
              />
            </figure>
          </div>

          <section className="w-full my-4 bg-base-100/50 px-4 py-3 rounded-md  space-y-3 border border-base-content/50">
            <div className="font-medium mx-auto w-fit">
              <h3 className="pb-3">Chỗ ngồi: ({chosenSeats.length})</h3>
              <p className="flex flex-wrap gap-1 justify-center">
                {chosenSeats.map((item) => (
                  <span
                    className="bg-base-content w-10 text-center px-2 py-1 rounded-md text-base-300"
                    key={`${item.row}${item.column}`}
                  >
                    {item.row}
                    {item.column}
                  </span>
                ))}
              </p>
            </div>
          </section>
          <button
            className={`btn btn-primary w-full rounded-full gap-2 ${chosenSeats.length === 0 ? "btn-disabled" : ""}`}
            type="submit"
          >
            <span className="btn-text">Đặt Ngay</span>
            <FiArrowRight className="inline-block mr-2 text-lg" />
          </button>
        </article>

        {/* Order ticket */}
        <article className="text-center col-span-8 space-y-5 w-full">
          <h1 className="text-4xl font-bold">Đặt vé</h1>
          <div className="space-y-5">
            <DatePicker currentDate={date} onChange={handleDateChange} />
            <ShowTimePicker
              time={time}
              onChange={(time) => {
                setTime(time);
              }}
            />
            <SeatMap data={datas} chosenSeats={chosenSeats} seatToggle={seatToggle} />
            <button className="btn btn-outline btn-ghost mt-12 btn-sm" onClick={selectAll}>
              Riêng tư
            </button>
          </div>
        </article>
      </div>
    </form>
  );
}

export default OnGoingPage;
