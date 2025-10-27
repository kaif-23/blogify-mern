import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Empty, Spin, Tag, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';

function MyBlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/user/signin');
            return;
        }

        const fetchMyBlogs = async () => {
            try {
                setLoading(true);
                const res = await api.get('/blog/myblogs');
                setBlogs(res.data);
                setError('');
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch your blogs.');
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMyBlogs();
    }, [user, navigate]);

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            try {
                await api.post(`/blog/delete/${blogId}`);
                setBlogs(currentBlogs => currentBlogs.filter(blog => blog._id !== blogId));
                message.success('Blog deleted successfully');
            } catch (err) {
                message.error(err.response?.data?.error || 'Failed to delete blog.');
            }
        }
    };

    if (loading) return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#0f0f23' }}>
            <Spin size="large" />
        </div>
    );

    return (
        <div className="min-vh-100" style={{ background: '#0f0f23' }}>
            <div className="container py-5">
                {/* Header */}
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#6366f1" viewBox="0 0 16 16">
                            <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z" />
                            <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z" />
                        </svg>
                    </div>
                    <h1 style={{
                        color: '#e0e0e0',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '12px'
                    }}>
                        My Blog Posts
                    </h1>
                    <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '24px' }}>
                        Manage and organize your content
                    </p>
                    <Link to="/blog/add-new">
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusCircleOutlined />}
                            style={{
                                background: '#6366f1',
                                border: 'none',
                                borderRadius: '8px',
                                height: '48px',
                                padding: '0 32px',
                                fontSize: '16px',
                                fontWeight: '600'
                            }}
                        >
                            Create New Post
                        </Button>
                    </Link>
                </div>

                {error && (
                    <Card style={{
                        background: '#1a1a2e',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <p style={{ color: '#ef4444', marginBottom: 0 }}>{error}</p>
                    </Card>
                )}

                {/* Blog List */}
                {blogs.length > 0 ? (
                    <div className="row g-4">
                        {blogs.map(blog => (
                            <div key={blog._id} className="col-12">
                                <Card
                                    hoverable
                                    style={{
                                        background: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        overflow: 'hidden'
                                    }}
                                    bodyStyle={{ padding: 0 }}
                                >
                                    <div className="row g-0">
                                        {/* Thumbnail */}
                                        <div className="col-md-4">
                                            <Link to={`/blog/${blog._id}`}>
                                                <div style={{
                                                    height: '100%',
                                                    minHeight: '220px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <img
                                                        src={getImageUrl(blog.coverImageURL)}
                                                        alt={blog.title}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.3s ease'
                                                        }}
                                                        onError={(e) => e.target.src = 'https://placehold.co/400x300/1a1a2e/6366f1?text=Blog'}
                                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                    />
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Content */}
                                        <div className="col-md-8">
                                            <div style={{ padding: '24px' }}>
                                                <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none' }}>
                                                    <h4 style={{
                                                        color: '#e0e0e0',
                                                        fontWeight: '600',
                                                        marginBottom: '12px',
                                                        fontSize: '1.4rem'
                                                    }}>
                                                        {blog.title}
                                                    </h4>
                                                </Link>

                                                <p style={{
                                                    color: '#9ca3af',
                                                    marginBottom: '16px',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '2',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {blog.body.substring(0, 150)}...
                                                </p>

                                                <div className="d-flex align-items-center mb-3">
                                                    <Tag
                                                        icon={<CalendarOutlined />}
                                                        style={{
                                                            background: 'rgba(99, 102, 241, 0.1)',
                                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                                            color: '#6366f1',
                                                            borderRadius: '6px'
                                                        }}
                                                    >
                                                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </Tag>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Link to={`/blog/${blog._id}`}>
                                                        <Button
                                                            icon={<EyeOutlined />}
                                                            style={{
                                                                background: 'rgba(99, 102, 241, 0.1)',
                                                                border: '1px solid #6366f1',
                                                                color: '#6366f1',
                                                                borderRadius: '8px'
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/blog/edit/${blog._id}`}>
                                                        <Button
                                                            icon={<EditOutlined />}
                                                            style={{
                                                                background: 'rgba(255,255,255,0.05)',
                                                                border: '1px solid rgba(255,255,255,0.1)',
                                                                color: '#9ca3af',
                                                                borderRadius: '8px'
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDelete(blog._id)}
                                                        style={{
                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                            border: '1px solid #ef4444',
                                                            borderRadius: '8px'
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card
                        style={{
                            background: '#1a1a2e',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px'
                        }}
                        bodyStyle={{ padding: '48px' }}
                    >
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{
                                height: 100,
                                opacity: 0.4
                            }}
                            description={
                                <div>
                                    <h3 style={{ color: '#e0e0e0', marginBottom: '8px' }}>No Posts Yet</h3>
                                    <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                                        Start your blogging journey by creating your first post!
                                    </p>
                                </div>
                            }
                        >
                            <Link to="/blog/add-new">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlusCircleOutlined />}
                                    style={{
                                        background: '#6366f1',
                                        border: 'none',
                                        borderRadius: '8px',
                                        height: '48px',
                                        padding: '0 32px',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Create Your First Post
                                </Button>
                            </Link>
                        </Empty>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default MyBlogsPage;