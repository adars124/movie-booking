import http from "@/http";
import { useLocation, useParams } from "react-router-dom";

export default function Booking() {
    const location = useLocation();
    const params = useParams();

    const handleSubmit = async (ev: React.ChangeEvent<any>) => {
        ev.preventDefault();

        const amt = location.state.data.bookedSeats.length * 200;

        const data = {
            amount: amt,
            movie_id: params.id
        };

        await http.post('/booking/order', {
            data
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => esewaCall(res.data.formData)).catch(err => console.log("ORDER ERROR", err));

    };

    const esewaCall = (formData: any) => {
        console.log(formData);
        var path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", path);
        // To open in a new window
        // form.setAttribute("target", "_blank");

        for (var key in formData) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", formData[key]);
            form.appendChild(hiddenField);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-black rounded bg-blue-300 p-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Booking Details</h1>
                <div className="mb-4">
                    <p className="text-lg">Booked Seats: <span className="text-sm">[{location.state.data.bookedSeats.map((seat: any) => (<span key={`${Date.now()}`}>{seat},</span>))}]</span></p>
                    <p className="text-lg truncate">Showtime: <span className="text-sm">{location.state.data.showtime_id}</span></p>
                    <p className="text-lg">Total Amount: <span className="text-sm">{location.state.data.bookedSeats.length * 200}</span></p>
                </div>
                <button onClick={handleSubmit} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
                    Continue to Payment
                </button>
            </div>
        </div>
    );
};