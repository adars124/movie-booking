import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import Related from "@/components/Related";
// import { useParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import http from "@/http";
// import { MovieProp } from "./Home";

export interface SeatProps {
    seat_id: any;
    seat_number: number;
    is_booked: boolean;
};

export default function Details() {

    const [movies, setMovies] = useState([]);

    const loadMovies = async () => {
        await http.get(`${import.meta.env.VITE_API_URL}/common/listMovies`).then((res: AxiosResponse<any>) => setMovies(res.data.movies)).catch(err => console.log(err.data.response));
    };

    useEffect(() => {
        loadMovies();
    }, []);
    return (
        <div className="min-h-screen">
            <HeroSection />
            <Related title="Related" movies={movies} />
        </div>
    );
};