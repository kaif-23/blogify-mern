import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { Link } from 'react-router-dom';

// Modern Skeleton Loader with shimmer effect
const BlogCardSkeleton = () => (
    <div className="col">
        <div className="card h-100 border-0 shadow-sm overflow-hidden">
            <div className="placeholder-glow">
                <div className="placeholder bg-secondary w-100" style={{ height: '240px' }}></div>
            </div>
            <div className="card-body">
                <div className="placeholder-glow">
                    <h5 className="placeholder col-9 bg-secondary"></h5>
                    <p className="placeholder col-12 bg-secondary"></p>
                    <p className="placeholder col-10 bg-secondary"></p>
                    <p className="placeholder col-7 bg-secondary"></p>
                </div>
            </div>
            <div className="card-footer bg-transparent border-0">
                <div className="d-flex align-items-center placeholder-glow">
                    <div className="placeholder rounded-circle bg-secondary me-2" style={{ width: '32px', height: '32px' }}></div>
                    <span className="placeholder col-5 bg-secondary"></span>
                </div>
            </div>
        </div>
    </div>
);

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
        <div className="container mt-5">
            <div className="alert alert-danger border-0 shadow-sm text-center rounded-4" role="alert">
                <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                    </svg>
                </div>
                <h4 className="alert-heading mb-2">Oops! Something went wrong</h4>
                <p className="mb-0">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-vh-100" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)' }}>
            {/* Hero Section */}
            <div className="container">
                <header className="text-center py-5">
                    <div className="mb-4">
                        <span className="badge bg-primary bg-gradient px-4 py-2 rounded-pill fs-6 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stars me-2" viewBox="0 0 16 16">
                                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
                            </svg>
                            Explore Latest Stories
                        </span>
                    </div>
                    <h1 className="display-4 fw-bold mb-3" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Discover Amazing Content
                    </h1>
                    <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                        Dive into a world of creativity and knowledge. Join our community of writers and readers.
                    </p>
                </header>

                {/* Blog Cards Grid */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 pb-5">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => <BlogCardSkeleton key={index} />)
                    ) : blogs.length > 0 ? (
                        blogs.map(blog => (
                            <div className="col" key={blog._id}>
                                <div className="card h-100 border-0 shadow-sm overflow-hidden position-relative"
                                    style={{
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                                    }}>
                                    {/* Image Container with Overlay */}
                                    <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                                        <Link to={`/blog/${blog._id}`}>
                                            <img
                                                src={getImageUrl(blog.coverImageURL)}
                                                className="card-img-top w-100 h-100"
                                                alt={blog.title}
                                                style={{
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                onError={(e) => e.target.src = 'https://placehold.co/600x400/667eea/ffffff?text=Blog+Post'}
                                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                            />
                                        </Link>
                                        <div className="position-absolute top-0 start-0 p-3">
                                            <span className="badge bg-white text-dark shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-clock me-1" viewBox="0 0 16 16">
                                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                                </svg>
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="card-body d-flex flex-column">
                                        <Link to={`/blog/${blog._id}`} className="text-decoration-none">
                                            <h5 className="card-title fw-bold text-dark mb-3 lh-base"
                                                style={{
                                                    fontSize: '1.1rem',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '2',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                {blog.title}
                                            </h5>
                                        </Link>
                                        <p className="card-text text-muted small mb-4 flex-grow-1"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: '3',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                lineHeight: '1.6'
                                            }}>
                                            {blog.body.substring(0, 120)}...
                                        </p>

                                        {/* Author Info & CTA */}
                                        <div className="border-top pt-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={getImageUrl(blog.createdBy?.profileImageURL)}
                                                        width="32"
                                                        height="32"
                                                        className="rounded-circle me-2 border border-2 border-light shadow-sm"
                                                        alt={blog.createdBy?.fullName || 'Author'}
                                                        onError={(e) => e.target.src = 'https://placehold.co/32x32/667eea/ffffff?text=A'}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                    <small className="text-muted fw-medium">
                                                        {blog.createdBy ? blog.createdBy.fullName : 'Anonymous'}
                                                    </small>
                                                </div>
                                                <Link
                                                    to={`/blog/${blog._id}`}
                                                    className="btn btn-sm btn-primary rounded-pill px-3"
                                                    style={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500'
                                                    }}>
                                                    Read
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-arrow-right ms-1" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="text-center py-5 my-5">
                                <div className="mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-journal-text text-muted opacity-50" viewBox="0 0 16 16">
                                        <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                                    </svg>
                                </div>
                                <h3 className="fw-bold mb-3">No Posts Yet</h3>
                                <p className="text-muted mb-4">Be the first to share your story with the world!</p>
                                <Link to="/blog/add-new" className="btn btn-primary btn-lg rounded-pill px-5 shadow">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle me-2" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                    </svg>
                                    Create Your First Post
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;