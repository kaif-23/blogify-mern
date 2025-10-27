import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/api';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm"
            style={{
                background: '#1a1a2e',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
            <div className="container">
                {/* Brand Logo */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#6366f1" className="me-2" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                        </svg>
                        <span className="fw-bold fs-4" style={{ color: '#e0e0e0' }}>Blogify</span>
                    </div>
                </Link>

                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    style={{ boxShadow: 'none' }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Links */}
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-2">
                        {/* Home Link */}
                        <li className="nav-item">
                            <Link
                                className={`nav-link px-3 py-2 rounded-2 ${isActive('/') ? 'active' : ''}`}
                                to="/"
                                style={{
                                    transition: 'all 0.2s ease',
                                    color: isActive('/') ? '#6366f1' : '#b0b0b0',
                                    background: isActive('/') ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive('/')) {
                                        e.currentTarget.style.color = '#e0e0e0';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive('/')) {
                                        e.currentTarget.style.color = '#b0b0b0';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door me-1 mb-1" viewBox="0 0 16 16">
                                    <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
                                </svg>
                                Home
                            </Link>
                        </li>

                        {user ? (
                            <>
                                {/* Add New Blog Link */}
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link px-3 py-2 rounded-2 ${isActive('/blog/add-new') ? 'active' : ''}`}
                                        to="/blog/add-new"
                                        style={{
                                            transition: 'all 0.2s ease',
                                            color: isActive('/blog/add-new') ? '#6366f1' : '#b0b0b0',
                                            background: isActive('/blog/add-new') ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive('/blog/add-new')) {
                                                e.currentTarget.style.color = '#e0e0e0';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive('/blog/add-new')) {
                                                e.currentTarget.style.color = '#b0b0b0';
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square me-1 mb-1" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>
                                        Write
                                    </Link>
                                </li>

                                {/* User Dropdown */}
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center px-2 py-1 rounded-2"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        style={{
                                            transition: 'all 0.2s ease',
                                            cursor: 'pointer',
                                            color: '#b0b0b0'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.color = '#e0e0e0';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#b0b0b0';
                                        }}
                                    >
                                        <img
                                            src={getImageUrl(user?.profileImageURL)}
                                            alt={user?.fullName || 'User'}
                                            className="rounded-circle me-2"
                                            width="36"
                                            height="36"
                                            style={{
                                                objectFit: 'cover',
                                                border: '2px solid #6366f1'
                                            }}
                                            onError={(e) => e.target.src = 'https://placehold.co/36x36/6366f1/ffffff?text=U'}
                                        />
                                        <span className="d-none d-lg-inline me-1">{user?.fullName || 'User'}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-3 mt-2"
                                        style={{
                                            minWidth: '220px',
                                            background: '#16213e',
                                            padding: '0.5rem'
                                        }}>
                                        <li>
                                            <div className="px-3 py-2 mb-2" style={{
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                borderRadius: '0.5rem'
                                            }}>
                                                <div className="small" style={{ color: '#9ca3af' }}>Signed in as</div>
                                                <div className="fw-semibold text-truncate" style={{ color: '#e0e0e0' }}>{user?.fullName}</div>
                                                <div className="small text-truncate" style={{ color: '#6b7280' }}>{user?.email}</div>
                                            </div>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center"
                                                to="/my-blogs"
                                                style={{
                                                    color: '#b0b0b0',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                                    e.currentTarget.style.color = '#6366f1';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#b0b0b0';
                                                }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-text me-2" viewBox="0 0 16 16">
                                                    <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                                                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                                                </svg>
                                                My Posts
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider my-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></li>
                                        <li>
                                            <button
                                                className="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center w-100"
                                                onClick={handleLogout}
                                                style={{
                                                    color: '#ef4444',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right me-2" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Sign Up Link */}
                                <li className="nav-item">
                                    <Link
                                        className="nav-link px-3 py-2 rounded-2"
                                        to="/user/signup"
                                        style={{
                                            transition: 'all 0.2s ease',
                                            color: '#b0b0b0'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#e0e0e0';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#b0b0b0';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        Sign Up
                                    </Link>
                                </li>

                                {/* Sign In Button */}
                                <li className="nav-item">
                                    <Link
                                        className="btn rounded-2 px-4 py-2"
                                        to="/user/signin"
                                        style={{
                                            background: '#6366f1',
                                            color: '#ffffff',
                                            border: 'none',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#4f46e5';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#6366f1';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Sign In
                                    </Link>
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