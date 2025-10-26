import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import AddBlogPage from './pages/AddBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import { AuthProvider } from './context/AuthContext';
import MyBlogsPage from './pages/MyBlogsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/user/signin" element={<SigninPage />} />
          <Route path="/user/signup" element={<SignupPage />} />
          <Route path="/blog/add-new" element={<AddBlogPage />} />
          <Route path="/blog/edit/:id" element={<EditBlogPage />} />
          <Route path="/my-blogs" element={<MyBlogsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;