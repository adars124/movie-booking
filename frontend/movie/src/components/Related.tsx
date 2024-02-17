import { MovieProp } from "@/pages/home/Home";
import { Link } from "react-router-dom";

export default function Related({ movies, title }: { movies: MovieProp[], title: String }) {
    return (
        <div className='border p-5'>
            <h1 className="flex mb-4 justify-center items-center">
                <span className='text-4xl mx-auto text-gray-800 font-extrabold'>{title}</span>
            </h1>
            <div className='flex flex-col justify-center items-center gap-10 md:flex-row'>
                {
                    movies.map((movie: MovieProp) => (
                        <div key={movie.movie_id} className='text-black border bg-white flex flex-col justify-between rounded shadow-lg p-5 w-64 h-80'>
                            <div className=''><img src={`${import.meta.env.VITE_API_URL}/images/${movie.poster_url}`} alt="image" /></div>
                            <div>
                                <h2 className='text-lg md:text-xl font-semibold'>{movie.title}</h2>
                                <p className='text-sm md:text-base text-lime-900 mb-2'>Genre: <span className='text-gray-700'>{movie.genre}</span></p>
                                <Link to={`/details/${movie.movie_id}`} className='block px-3 py-1.5 bg-slate-500 text-white hover:bg-slate-700 transition rounded text-center'>Book Now</Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}