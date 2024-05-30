import logo from '@/assets/react.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, clearUser } from '../state/';
import { clearStorage } from '@/lib';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
    const user = useSelector((state: RootState) => state.user.value);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        clearStorage('token');
        dispatch(clearUser());
        navigate('/');
    };

    const paths = [
        {
            id: 1,
            name: "Movies",
            href: "/"
        },
        // {
        //     id: 2,
        //     name: "Courses",
        //     href: "/courses"
        // },
        // {
        //     id: 3,
        //     name: "About Us",
        //     href: "/about"
        // },
        // {
        //     id: 4,
        //     name: "Contacts",
        //     href: "/contact"
        // }
    ];

    return (
        <header className="w-full">
            <div className="navbar bg-base-200">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {
                                paths.map((path: any) => (
                                    <li key={path.id}><Link to={path.href}>{path.name}</Link></li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="navbar-center space-x-3">
                    <img src={logo} alt="logo" />
                    <Link to="/" className="text-xl">Movie</Link>
                </div>
                <div className="navbar-end">
                    {
                        Object.keys(user).length ?
                            (
                                <div className='p-2'>
                                    <button onClick={logout} className='btn btn-ghost'>Logout</button>
                                </div>
                            ) :
                            (
                                <div className="p-2 flex gap-2">
                                    <Link to="/login" className="btn btn-ghost">Login</Link>
                                    <Link to="/register" className="btn btn-ghost">Register</Link>
                                </div>
                            )
                    }
                </div>
            </div>
        </header>
    )
};
