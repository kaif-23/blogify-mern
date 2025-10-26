import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark border-bottom border-body shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold fs-4" to="/">Blogify</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/blog/add-new">Add New Blog</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                                        <img
                                            src={user.profileImageURL}
                                            alt={user.fullName}
                                            className="rounded-circle me-2" width="30" height="30"
                                            onError={(e) => e.target.src = 'https://placehold.co/30x30/aabbcc/ffffff?text=U'}
                                        />
                                        {user.fullName}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/user/signup">Create Account</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/user/signin">Signin</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;