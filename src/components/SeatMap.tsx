import { Seat as SeatEnitiy, SeatMap as SeatMapEntity } from "../entity/Seat";
import Seat from "./Seat";

type SeatMapProps = {
  data: SeatMapEntity;
  seatToggle: (seat: SeatEnitiy) => void;
  chosenSeats: SeatEnitiy[];
};

export default function SeatMap({ data, seatToggle, chosenSeats }: SeatMapProps) {
  return (
    <div className="gap-2 flex flex-col justify-center items-center">
      {/* Screen here */}
      <div className="w-full mx-auto h-fit my-4">
        <div className="w-1/2 h-4 rounded-full mx-auto rounded-b-xl border bg-slate-700 border-base-200"></div>
        <span className="text-sm py-2">Màn hình</span>
      </div>
      <div>
        {Array.from({ length: data.rows }, (_, i) => {
          return (
            <div className="flex gap-2" key={data.seats[i].id}>
              {Array.from({ length: data.columns }, (_, j) => {
                return (
                  <div className="flex" key={data.seats[j].column}>
                    <Seat
                      seatData={data.seats[i * data.columns + j]}
                      seatToggle={seatToggle}
                      isTaken={data.seats[i * data.columns + j].reserved}
                      isChosen={
                        chosenSeats.find((item) => item.id === data.seats[i * data.columns + j].id) ? true : false
                      }
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
