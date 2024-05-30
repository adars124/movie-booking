import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFromStorage, clearStorage } from "../lib/";
import { useNavigate } from "react-router-dom";
import http from "../http";
import { RootState, addUser } from "../state";
import toast from "react-hot-toast";

interface PrivateRouteProps {
    element?: React.ReactNode
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const user = useSelector((state: RootState) => state.user.value);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (Object.keys(user).length == 0) {
            const token = getFromStorage('token');

            if (token) {
                http.get('/common/user/details')
                    .then(({ data }) => {
                        console.log(data);
                        dispatch(addUser(data.user))
                    })
                    .catch(err => {
                        console.log(err);
                        clearStorage('token');
                        navigate('/login');
                    })
            } else {
                toast.error("Please login to continue!");
                navigate('/login')
            }
        } else {
            toast.success("User Authenticated!");
        }
    }, [user])

    return element;
}

export default PrivateRoute
