import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Input, Button, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, UserAddOutlined } from '@ant-design/icons';

function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(fullName, email, password);
            navigate('/user/signin');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center" style={{ background: '#0f0f23' }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <Card
                            style={{
                                background: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px'
                            }}
                            bodyStyle={{ padding: '40px' }}
                        >
                            {/* Logo/Header */}
                            <div className="text-center mb-4">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '50%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '16px'
                                }}>
                                    <UserAddOutlined style={{ fontSize: '40px', color: '#6366f1' }} />
                                </div>
                                <h2 style={{ color: '#e0e0e0', fontWeight: '700', marginBottom: '8px' }}>
                                    Join Blogify!
                                </h2>
                                <p style={{ color: '#9ca3af', marginBottom: 0 }}>
                                    Create your account to start blogging
                                </p>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <Alert
                                    message={error}
                                    type="error"
                                    showIcon
                                    closable
                                    onClose={() => setError('')}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid #ef4444',
                                        borderRadius: '8px',
                                        marginBottom: '24px'
                                    }}
                                />
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* Full Name Field */}
                                <div className="mb-3">
                                    <label style={{
                                        color: '#e0e0e0',
                                        fontWeight: '600',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}>
                                        Full Name
                                    </label>
                                    <Input
                                        size="large"
                                        prefix={<UserOutlined style={{ color: '#6b7280' }} />}
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        disabled={loading}
                                        style={{
                                            background: '#0f0f23',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#e0e0e0'
                                        }}
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="mb-3">
                                    <label style={{
                                        color: '#e0e0e0',
                                        fontWeight: '600',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}>
                                        Email Address
                                    </label>
                                    <Input
                                        size="large"
                                        prefix={<MailOutlined style={{ color: '#6b7280' }} />}
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        disabled={loading}
                                        style={{
                                            background: '#0f0f23',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#e0e0e0'
                                        }}
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="mb-3">
                                    <label style={{
                                        color: '#e0e0e0',
                                        fontWeight: '600',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}>
                                        Password
                                    </label>
                                    <Input.Password
                                        size="large"
                                        prefix={<LockOutlined style={{ color: '#6b7280' }} />}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Choose a strong password"
                                        required
                                        disabled={loading}
                                        minLength={6}
                                        iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                        style={{
                                            background: '#0f0f23',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#e0e0e0'
                                        }}
                                    />
                                    <p style={{
                                        color: '#6b7280',
                                        fontSize: '13px',
                                        marginTop: '6px',
                                        marginBottom: 0
                                    }}>
                                        Password must be at least 6 characters
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    icon={<UserAddOutlined />}
                                    style={{
                                        background: '#6366f1',
                                        border: 'none',
                                        borderRadius: '8px',
                                        height: '48px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        marginTop: '24px',
                                        marginBottom: '24px'
                                    }}
                                >
                                    Create Account
                                </Button>
                            </form>

                            {/* Divider */}
                            <div style={{
                                position: 'relative',
                                textAlign: 'center',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: '#1a1a2e',
                                        padding: '0 16px',
                                        color: '#6b7280',
                                        fontSize: '14px'
                                    }}>
                                        Already a member?
                                    </span>
                                </div>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center">
                                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>
                                    Already have an account?
                                </p>
                                <Link to="/user/signin">
                                    <Button
                                        size="large"
                                        block
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            height: '48px',
                                            color: '#e0e0e0',
                                            fontSize: '16px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Footer Text */}
                        <p style={{
                            textAlign: 'center',
                            color: '#6b7280',
                            fontSize: '13px',
                            marginTop: '24px',
                            marginBottom: 0
                        }}>
                            By signing up, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;