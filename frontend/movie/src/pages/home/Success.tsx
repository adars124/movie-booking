import http from "@/http";
import { RootState } from "@/state";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

export default function Success() {
    const data = useSelector((state: RootState) => state.data);
    const [ticket, setTicket] = useState<any>({});

    const params = useParams();
    const ticketRef = useRef<any>(null);
    const location = useLocation();

    function formatDate(timestamp: Date) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const createBooking = async () => {
        const movie_id = params.id;
        const token = location.search.split("data=")[1];

        await http.post(`/booking/${movie_id}/create?data=${token}`, {
            bookedSeats: data.bookedSeats,
            showtime_id: data.showtime_id
        }).then(res => setTicket(res.data.ticket)).catch(err => console.log(err));
    };

    const downloadTicket = () => {
        const ticketContent = ticketRef.current.outerHTML;

        // Convert ticket content to a Blob
        const blob = new Blob([ticketContent], { type: 'text/html' });

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'ticket.html';

        // Trigger download
        downloadLink.click();
    }

    useEffect(() => {
        createBooking();
    }, [params.id]);

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div ref={ticketRef} className=" bg-white gap-4 rounded w-80 flex flex-col p-5 justify-center items-center">
                <div className="w-full border-2 border-gray-500 border-dashed p-4 h-auto">
                    <h2 className="text-black text-lg font-bold truncate mb-2">Ticket ID: {ticket.ticket_id}</h2>
                    <p className="text-black truncate text-sm">Booking ID: {ticket.booking_id} </p>
                    <p className="text-black text-sm">Expiry: {formatDate(ticket.expiration_time)}</p>
                </div>
                <div>
                    <button onClick={downloadTicket} className="text-gray-900 px-3 text-sm py-1.5 rounded bg-blue-200 hover:bg-blue-400 transition">Download</button>
                </div>
            </div>

        </div>
    );
};