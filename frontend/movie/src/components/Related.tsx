import { MovieProp } from "@/pages/home/Home";
import { Link } from "react-router-dom";
import { Fragment } from "react";

export default function Related({ movies, title }: { movies: MovieProp[], title: String }) {
    return (
        <div className='border p-5'>
            <h1 className="flex mb-4 justify-center items-center">
                <span className='text-4xl mx-auto text-gray-800 font-extrabold'>{title}</span>
            </h1>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                {
                    movies.length ? movies.map((movie: MovieProp) => (
                        <Fragment key={movie.movie_id}>
                            {
                                movie.featured === true && <div className="text-black border bg-white flex flex-col justify-between rounded shadow-lg p-5 w-64 h-80">
                                    <div className="flex justify-center items-center h-40 overflow-hidden">
                                        <img src={`${import.meta.env.VITE_API_URL}/images/${movie.poster_url}`} alt="image" className="max-h-full max-w-full" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg md:text-xl font-semibold">{movie.title}</h2>
                                        <p className="text-sm md:text-base text-lime-900 mb-2">Genre: <span className="text-gray-700">{movie.genre}</span></p>
                                        <Link to={`/details/${movie.movie_id}`} className="block px-3 py-1.5 bg-slate-500 hover:bg-slate-700 transition text-white rounded text-center">Book Now</Link>
                                    </div>
                                </div>
                            }
                        </Fragment>
                    )) : <span className="text-black">No data available!</span>
                }
            </div>
        </div>
    );
}