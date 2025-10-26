import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(fullName, email, password);
            // After signup, redirect to signin
            navigate('/user/signin');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to sign up.');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg p-4">
                        <h2 className="card-title text-center mb-4 text-primary">Join Blogify!</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="fullNameInput" className="form-label fw-bold">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fullNameInput"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="emailInput" className="form-label fw-bold">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="emailInput"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@example.com"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="passwordInput" className="form-label fw-bold">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="passwordInput"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Choose a strong password"
                                />
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary btn-lg">Create Account</button>
                            </div>
                            <p className="text-center mt-3 mb-0 text-muted">
                                Already have an account? <Link to="/user/signin">Sign In here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;