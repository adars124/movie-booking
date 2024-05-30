import { AxiosResponse } from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import Related from '@/components/Related';
import http from '@/http';

export interface MovieProp {
    movie_id: any;
    title: String;
    description: String;
    genre: String;
    released_date: Date;
    featured: boolean;
    poster_url: any;
    status: String;
}

export default function Home() {
    const [movies, setMovies] = useState([]);

    const loadMovies = async () => {
        http.get(`${import.meta.env.VITE_API_URL}/common/listMovies`).then((res: AxiosResponse<any>) => setMovies(res.data.movies)).catch(err => console.log(err.data.response));
    };

    useEffect(() => {
        loadMovies();
    }, []);
    return (
        <div className="min-h-screen">
            <div className="flex flex-col gap-10 p-5">
                <div className="border p-5">
                    <h1 className="flex mb-4 justify-center items-center">
                        <span className="text-4xl mx-auto text-gray-800 font-extrabold">Featured</span>
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
                <Related title="All Movies" movies={movies} />
            </div>
        </div>

    );
};