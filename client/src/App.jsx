
import  {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Projects from './pages/Projects'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import CreatePost from './pages/CreatePost'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'
import Description from './pages/Description'


function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
    <Header /> 
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About />}/>
      <Route path="/signin" element={<SignIn />}/>
      <Route path="/signup" element={<SignUp />}/>
      <Route path="/search" element={<Search />}/>
      <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />}/>
      </Route>
   <Route element={<OnlyAdminPrivateRoute />}>
       <Route path='/create-post' element={<CreatePost />} />
       <Route path='/update-post/:postId' element={<UpdatePost />} />
       <Route path='/sentiment-analysis' element={<Description />} />
   </Route>   

      {/* <Route path="/projects" element={<Projects />}/> */}
      <Route path="/post/:postSlug" element={<PostPage />}/>
      <Route path="/*" element={<NotFound />}/>
    
    
    
    </Routes>
    <Footer />
    </BrowserRouter>
  )
}

export default App
