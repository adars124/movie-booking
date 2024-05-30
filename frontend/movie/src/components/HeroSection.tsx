import http from "@/http";
import { SeatProps } from "@/pages/home/Details";
import { setData } from "@/state";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function HeroSection() {
    const [seats, setSeats] = useState<any>([]);
    const [showtimes, setShowtimes] = useState<any>([]);
    const [movie, setMovie] = useState<any>({});
    const [selectedShowtime, setSelectedShowtime] = useState<string>('');
    const [selectedSeats, setSelectedSeats] = useState<any>([]);

    // Hooks for getting URL parameters and navigation
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // FETCH MOVIE DATA
    const loadMovie = async () => {
        let url = `/common/getMovieById/${params.id}`;
        await http.get(url).then((res: any) => {
            setMovie(res.data.movie[0])
        }).catch(err => console.log(err))
    };

    // FETCH SHOWTIMES OF A PARTICULAR MOVIE (we get movie ID from the URL)
    const loadShowtimes = async () => {
        let url = `/common/showtimes/${params.id}`;
        await http.get(url).then((res: AxiosResponse<any>) => setShowtimes(res.data.showtimes)).catch(err => console.log(err.response.data.message))
    }

    // FETCH SEATS ASSOCIATED WITH A SHOWTIME
    const loadSeats = async (showtime_id: any) => {
        const id = showtime_id ? showtime_id : '';
        let url = `/common/seats/${id}`;
        await http.get(url).then((res: AxiosResponse<any>) => setSeats(res.data.seats)).catch(err => { })
    };

    // Handle change when the user selects a showtime
    const handleChange = (ev: React.ChangeEvent<any>) => {
        const selectedShowtimeValue = ev.target.value;

        if (!(selectedShowtimeValue === "Choose Showtimes")) {
            setSelectedShowtime(selectedShowtimeValue);
            loadSeats(selectedShowtimeValue);
        }
    };

    // Counter for showtime
    let counter = 0;

    // Handle the event when the user clicks on seats
    const handleClick = (seatNumber: any) => {
        const index = selectedSeats.indexOf(seatNumber);
        if (index === -1) {
            setSelectedSeats([...selectedSeats, seatNumber]);
        } else {
            const updatedSeats = [...selectedSeats];
            updatedSeats.splice(index, 1);
            setSelectedSeats(updatedSeats);
        }

    };

    // Handle submit event
    const handleSubmit = async (ev: React.ChangeEvent<any>) => {
        ev.preventDefault();

        // If showtime is not selected show error and navigate to login
        if (!selectedShowtime) {
            toast.error("Please select a showtime!");
            navigate('/login');
        } else {
            const data = {
                bookedSeats: selectedSeats,
                showtime_id: selectedShowtime
            }

            // Store the data in store
            dispatch(setData({ bookedSeats: selectedSeats, showtime_id: selectedShowtime }));
            console.log('data added in store');

            // Navigate to the Booking page(continue to payment)
            navigate(`/booking/${params.id}/create`, { state: { data } });
        }
    }

    useEffect(() => {
        loadMovie();
        loadShowtimes();
    }, [params]);
    return (
        <div className="mt-10 p-5">
            <div className="flex flex-col bg-white rounded shadow-lg p-10 md:flex-row items-center justify-center gap-8">
                {/* Image Section */}
                <div className="md:w-1/2">
                    <img src={`${import.meta.env.VITE_API_URL}/images/${movie.poster_url}`} className="object-cover rounded shadow-lg" width={700} height={500} alt="hero image" />
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 font-extrabold text-teal-800">
                        {movie.title}
                    </h1>
                    <p className="mb-6 leading-relaxed text-gray-700">
                        {movie.description}
                    </p>
                    <p className='text-sm md:text-base text-lime-900 mb-2'>Genre: <span className='text-gray-700'>{movie.genre}</span></p>
                    <h1 className="text-black text-sm font-bold">Select Showtimes</h1>
                    <div className="mb-4">
                        <select onChange={handleChange} defaultValue={''} className="rounded p-2 select-bordered w-full max-w-xs">
                            <option selected>Choose Showtimes</option>
                            {
                                showtimes.length ? showtimes.map((showtime: any) => (
                                    <option key={showtime.showtime_id} value={showtime.showtime_id}>Showtime {counter + 1}</option>
                                )) : <option value="">No shows available</option>
                            }
                        </select>
                    </div>
                    {/* Conditionally render seats based on the selected showtime */}
                    {selectedShowtime && (
                        <div className="mb-4">
                            <div className="text-slate-500 text-sm">Only green colored seats are available!</div>
                            <div className="border p-4 flex gap-3 flex-wrap rounded">
                                {seats.map((seat: SeatProps) => (
                                    <div key={seat.seat_id}>
                                        {seat.is_booked === false ? (
                                            <div
                                                onClick={() => handleClick(seat.seat_number)}
                                                className={`text-black cursor-pointer h-7 w-7 text-center ${selectedSeats.includes(seat.seat_number)
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200'
                                                    } border border-gray-300 rounded`}
                                            >
                                                {seat.seat_number}
                                            </div>
                                        ) : (
                                            <div className="text-black bg-zinc-500 cursor-not-allowed border rounded h-7 w-7 text-center">
                                                {seat.seat_number}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <button onClick={handleSubmit} className="inline-block bg-teal-600 hover:bg-teal-800 text-white rounded py-2 px-6 transition-colors text-sm">
                        Book Now &#8618;
                    </button>
                </div>
            </div>
        </div >
    );
};

