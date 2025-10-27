import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { Link } from 'react-router-dom';
import { Card, Skeleton, Empty, Tag, Avatar } from 'antd';
import { ClockCircleOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;

function HomePage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await api.get('/blog');
                setBlogs(res.data);
            } catch (err) {
                setError('Failed to fetch blogs. Please try refreshing the page.');
            }
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    if (error) return (
        <div className="min-vh-100" style={{ background: '#0f0f23' }}>
            <div className="container py-5">
                <Card
                    style={{
                        background: '#1a1a2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px'
                    }}
                    bodyStyle={{ padding: '2rem', textAlign: 'center' }}
                >
                    <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ef4444" viewBox="0 0 16 16">
                            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                        </svg>
                    </div>
                    <h4 style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>Oops! Something went wrong</h4>
                    <p style={{ color: '#9ca3af', marginBottom: 0 }}>{error}</p>
                </Card>
            </div>
        </div>
    );

    return (
        <div className="min-vh-100" style={{ background: '#0f0f23' }}>
            <div className="container py-5">
                {/* Hero Section */}
                <header className="text-center mb-5">
                    
                    <h1 className="display-5 fw-bold mb-3" style={{ color: '#e0e0e0' }}>
                        Welcome to Blogify
                    </h1>
                    <p className="lead mb-4" style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
                        Explore amazing content from our community of writers
                    </p>
                </header>

                {/* Blog Cards Grid */}
                <div className="row g-4">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <div className="col-12 col-md-6 col-lg-4" key={index}>
                                <Card
                                    style={{
                                        background: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px'
                                    }}
                                    cover={
                                        <Skeleton.Image
                                            active
                                            style={{
                                                width: '100%',
                                                height: '240px',
                                                borderRadius: '12px 12px 0 0'
                                            }}
                                        />
                                    }
                                >
                                    <Skeleton active paragraph={{ rows: 3 }} />
                                </Card>
                            </div>
                        ))
                    ) : blogs.length > 0 ? (
                        blogs.map(blog => (
                            <div className="col-12 col-md-6 col-lg-4" key={blog._id}>
                                <Card
                                    hoverable
                                    style={{
                                        background: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    bodyStyle={{
                                        padding: '20px',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    cover={
                                        <Link to={`/blog/${blog._id}`}>
                                            <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                                                <img
                                                    alt={blog.title}
                                                    src={getImageUrl(blog.coverImageURL)}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.3s ease'
                                                    }}
                                                    onError={(e) => e.target.src = 'https://placehold.co/600x400/1a1a2e/6366f1?text=Blog+Post'}
                                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px'
                                                }}>
                                                    <Tag
                                                        icon={<ClockCircleOutlined />}
                                                        color="default"
                                                        style={{
                                                            background: 'rgba(26, 26, 46, 0.9)',
                                                            border: '1px solid rgba(255,255,255,0.2)',
                                                            color: '#e0e0e0',
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                    >
                                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </Tag>
                                                </div>
                                            </div>
                                        </Link>
                                    }
                                    actions={[
                                        <Link
                                            to={`/blog/${blog._id}`}
                                            style={{
                                                color: '#6366f1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                textDecoration: 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#6366f1'}
                                        >
                                            <EyeOutlined /> Read More
                                        </Link>
                                    ]}
                                >
                                    <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h5 style={{
                                            color: '#e0e0e0',
                                            marginBottom: '12px',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '2',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: '1.4'
                                        }}>
                                            {blog.title}
                                        </h5>
                                        <p style={{
                                            color: '#9ca3af',
                                            fontSize: '0.9rem',
                                            marginBottom: '16px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: '1.6',
                                            flex: 1
                                        }}>
                                            {blog.body.substring(0, 120)}...
                                        </p>
                                    </Link>

                                    <Meta
                                        avatar={
                                            <Avatar
                                                src={getImageUrl(blog.createdBy?.profileImageURL)}
                                                size={36}
                                                style={{ border: '2px solid #6366f1' }}
                                            >
                                                {blog.createdBy?.fullName?.[0] || 'A'}
                                            </Avatar>
                                        }
                                        title={
                                            <span style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                                                {blog.createdBy?.fullName || 'Anonymous'}
                                            </span>
                                        }
                                        description={
                                            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        }
                                    />
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <Card
                                style={{
                                    background: '#1a1a2e',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                                bodyStyle={{ padding: '3rem', textAlign: 'center' }}
                            >
                                <Empty
                                    image={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#6b7280" viewBox="0 0 16 16">
                                            <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                                        </svg>
                                    }
                                    imageStyle={{ height: 80 }}
                                    description={
                                        <div>
                                            <h4 style={{ color: '#e0e0e0', marginBottom: '8px' }}>No Posts Yet</h4>
                                            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                                                Be the first to share your story with the world!
                                            </p>
                                            <Link
                                                to="/blog/add-new"
                                                className="btn px-4 py-2"
                                                style={{
                                                    background: '#6366f1',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#4f46e5';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = '#6366f1';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <EditOutlined /> Create Your First Post
                                            </Link>
                                        </div>
                                    }
                                />
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;