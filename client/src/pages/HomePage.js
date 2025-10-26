import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { Link } from 'react-router-dom';

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
                setError('Failed to fetch blogs.');
            }
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (error) return <p className="alert alert-danger text-center">{error}</p>;

    return (
        <div className="container mt-4 mb-5">
            <h2 className="text-center mb-5 text-secondary">Discover Our Latest Blogs</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {blogs.length > 0 ? (
                    blogs.map(blog => (
                        <div className="col d-flex" key={blog._id}>
                            <div className="card h-100 shadow-sm border-0">
                                <img
                                    src={getImageUrl(blog.coverImageURL)}
                                    className="card-img-top"
                                    alt={blog.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={(e) => e.target.src = 'https://placehold.co/400x200/e0e0e0/555555?text=Blog+Cover'}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title text-primary">{blog.title}</h5>
                                    <p className="card-text text-muted mb-auto">
                                        {blog.body.substring(0, 120)}...
                                    </p>
                                    <Link to={`/blog/${blog._id}`} className="btn btn-outline-primary btn-sm mt-3 align-self-start rounded-pill">
                                        Read More &rarr;
                                    </Link>
                                </div>
                                <div className="card-footer bg-white border-top-0 pt-0 pb-2">
                                    <small className="text-muted d-flex align-items-center">
                                        <img
                                            src={getImageUrl(blog.createdBy?.profileImageURL)}
                                            width="28px" height="28px"
                                            className="rounded-circle me-2"
                                            alt={blog.createdBy?.fullName}
                                            onError={(e) => e.target.src = 'https://placehold.co/28x28/aabbcc/ffffff?text=U'}
                                        />
                                        {blog.createdBy ? blog.createdBy.fullName : 'Unknown Author'}
                                        <span className="ms-auto text-end" style={{ fontSize: '0.8em' }}>
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </span>
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center py-4" role="alert">
                            <h4 className="alert-heading">No blogs yet!</h4>
                            <p className="mb-0">Be the first to create one.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;