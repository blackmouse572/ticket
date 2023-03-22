import { useCallback, useMemo, useState } from "react";
import { GiPopcorn } from "react-icons/gi";
import { IoTicket } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { Movie } from "../entity/Movie";
import { PlaceOrder } from "../entity/PlaceOrder";
import { Seat } from "../entity/Seat";
import { ShowTime } from "../entity/ShowTime";
export type CheckoutFormProps = {
  movie: Movie;
  seats: Seat[];
  showTime: ShowTime;
  date: string | Date;
};
export type ComboProps = {
  name: string;
  price: number;
  description: string;
  img: string;
  details: {
    drinks: {
      amount: number;
      drink: {
        name: string;
      }[];
    };
    popcorn: {
      amount: number;
      popcorn: {
        name: string;
      }[];
    };
  };
};

const Combo = [
  {
    name: "Combo 1",
    price: 100000,
    description: "2x Popcorn and 2x Drinks",
    img: "/picture/combo1.png",
    details: {
      drinks: {
        amount: 2,
        drink: [
          {
            name: "Coca",
          },
          {
            name: "Pepsi",
          },
        ],
      },
      popcorn: {
        amount: 2,
        popcorn: [
          {
            name: "Popcorn",
          },
          {
            name: "Popcorn",
          },
        ],
      },
    },
  },
  {
    name: "Combo 2",
    price: 15000,
    description: "1x Popcorn and 2x Drinks",
    img: "/picture/combo2.jpg",
    details: {
      drinks: {
        amount: 2,
        drink: [
          {
            name: "Coca",
          },
          {
            name: "Pepsi",
          },
        ],
      },
      popcorn: {
        amount: 1,
        popcorn: [
          {
            name: "Popcorn",
          },
        ],
      },
    },
  },
];

function Checkout() {
  const { date, movie, seats, showTime } = useLocation().state as CheckoutFormProps;
  //Track selected combos and its amount
  const [selectedCombos, setSelectedCombos] = useState<{ [comboName: string]: number }>();
  const addCombo = useCallback((combo: ComboProps) => {
    //If selectedCombos is not null, add combo to it
    setSelectedCombos((prev) => {
      const updated = prev ? { ...prev } : {};

      if (updated[combo.name]) {
        updated[combo.name] = (updated[combo.name] || 0) + 1;
      } else {
        updated[combo.name] = 1;
      }
      return updated;
    });
  }, []);

  const removeCombo = useCallback((combo: ComboProps) => {
    //If selectedCombos is not null, remove combo from it
    setSelectedCombos((prev) => {
      const updated = prev ? { ...prev } : {};
      if (updated[combo.name]) {
        updated[combo.name] -= 1;
      }
      if (updated[combo.name] === 0) {
        delete updated[combo.name];
      }
      return updated;
    });
  }, []);

  const totalMoney = useMemo(() => {
    let total = 0;
    //Calculate total money
    if (selectedCombos) {
      Object.keys(selectedCombos).forEach((comboName) => {
        const combo = Combo.find((combo) => combo.name === comboName);
        if (combo) {
          total += combo.price * (selectedCombos[comboName] || 0);
        }
      });
    }

    //Add seats price
    total += seats.length * 80000;
    return total;
  }, [selectedCombos]);

  async function placeOrder() {
    //If no seats selected nor showtime selected, return
    if (!seats.length || !showTime) return;
    const order: PlaceOrder = {
      products: [],
      tickets: {
        showTimeId: showTime.id || "",
        tickets:
          seats.map((seat) => ({
            seatNumber: seat.seatNumber.toString(),
            seatRow: seat.rowName,
          })) || [],
      },
    };

    //Post order to server
    try {
      const header = new Headers();
      header.append("Origin", "http://localhost:5174");
      header.append("Access-Control-Request-Method", "POST");
      header.append("Access-Control-Request-Headers", "content-type");
      header.append("Access-Control-Allow-Origin", "http://localhost:5174");
      header.append("Content-Type", "text/plain");

      const res = await fetch("https://localhost:7193/api/Tickets/placeOrder", {
        method: "POST",
        body: JSON.stringify(order),
        headers: header,
        credentials: "include",
      });

      if (res.status === 200) {
        alert("Đặt vé thành công");
        console.log(res);
      } else {
        alert("Đặt vé thất bại");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="container mx-auto bg-base-300 h-screen grid grid-cols-12 gap-3">
      {/* Combo popcorn and drinks*/}
      <div className="bg-base-100 px-4 py-5 col-span-8 w-full grid grid-cols-2 text-sm lg:text-base">
        <section className="col-span-2">
          <h2 className="text-lg font-bold my-3 flex gap-2 items-center">
            <GiPopcorn />
            BẮP VÀ NƯỚC
          </h2>
          <div className="divider divider-horizontal h-[0.05rem] bg-base-content/40 space-y-3 my-3 w-full" />
          <div className="grid grid-cols-3 gap-4">
            {Combo.map((combo) => (
              <div
                key={combo.name}
                className={
                  "bg-base-300 px-3 py-2 rounded-md flex items-center justify-between cursor-pointer col-span-3 lg:col-span-1"
                }
              >
                <div>
                  <h3 className="font-bold flex justify-between">
                    <span>{combo.name}</span>
                    <span>{combo.price.toLocaleString("vi-VN")}</span>
                  </h3>
                  <p>{combo.description}</p>
                </div>

                <div className="divider-horizontal vertical divider bg-base-content/40 w-[0.05rem] rounded-full" />
                <div className="flex-col flex justify-between items-center">
                  <button className="" onClick={() => addCombo(combo)}>
                    <MdKeyboardArrowUp />
                  </button>
                  <h6>{selectedCombos && selectedCombos[combo.name] ? selectedCombos[combo.name] : 0}</h6>
                  <button className="" onClick={() => removeCombo(combo)}>
                    <MdKeyboardArrowDown />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="md:col-span-2">
          <h2 className="text-lg font-bold my-3 uppercase flex gap-2 items-center">
            <IoTicket />
            Thông tin vé
          </h2>
          <div className="divider divider-horizontal h-[0.05rem] bg-base-content/40 space-y-3 my-3 w-full" />
          <div className="bg-base-300 px-3 py-2 rounded-md flex items-center justify-between cursor-pointer ">
            <section className="flex justify-between w-full text-xs lg:text-base ">
              <span>Ngày chiếu</span>
              <h3 className="font-bold">
                <span>
                  {new Date(showTime.startTime as string).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </h3>
            </section>

            <div className="divider-horizontal vertical divider bg-base-content/40 w-[0.05rem] rounded-full" />
            <section className="flex justify-between w-full text-xs lg:text-base ">
              <span>Giờ chiếu</span>
              <h3 className="font-bold">
                <span>{`${new Date(showTime.startTime as string).getHours()}:${new Date(
                  showTime.endTime as string
                ).getMinutes()}`}</span>
              </h3>
            </section>

            <div className="divider-horizontal vertical divider bg-base-content/40 w-[0.05rem] rounded-full" />
            <section className="flex justify-between w-full text-sm lg:text-base ">
              <span>Phòng chiếu</span>
              <h3 className="font-bold">
                <span>{showTime.roomNumberId}</span>
              </h3>
            </section>
          </div>
        </section>
      </div>
      {/* Details */}
      <div className="bg-secondary-focus/80 text-white px-4 py-5 col-span-4 w-full">
        <article className="mx-auto text-center flex justify-center items-center flex-col">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-36" />
          <h2 className="text-lg font-bold">{movie.title}</h2>
          <div className="divider divider-horizontal h-[0.05rem] bg-base-content/40 space-y-3 my-3 w-full" />
          <div className="w-full space-y-3 font-semibold">
            {seats.map((seat) => (
              <div className="flex justify-between" key={seat.id}>
                <p>{seat.id}</p>
                <p>80.000</p>
              </div>
            ))}
          </div>
          <div className="w-full space-y-3 font-semibold">
            {
              //Render selected combos
              selectedCombos &&
                Object.keys(selectedCombos).map((comboName) => (
                  <div className="flex justify-between" key={comboName}>
                    <p>
                      {comboName} x{selectedCombos[comboName]}
                    </p>
                    <p>
                      {
                        //get total price of combo
                        (
                          Combo.find((combo) => combo.name === comboName)?.price! * selectedCombos[comboName]
                        ).toLocaleString("vi-Vn")
                      }
                    </p>
                  </div>
                ))
            }
          </div>
          <div className="divider divider-horizontal h-[0.05rem] bg-base-content/40 space-y-3 my-3 w-full" />
          <div className="flex justify-between w-full font-bold">
            <h3>Tổng tiền</h3>
            <p>
              {totalMoney.toLocaleString("vi-VN")} <span>đ</span>
            </p>
          </div>

          <div></div>

          <button
            className="btn btn-primary w-full rounded-full my-4 btn-sm"
            onClick={() => {
              placeOrder();
            }}
          >
            {/* <Link to="/payment"> */}
            Thanh toán bằng <span className="text-bold text-error">VNPAY</span>
            {/* </Link> */}
          </button>
        </article>
      </div>
    </div>
  );
}

export default Checkout;
