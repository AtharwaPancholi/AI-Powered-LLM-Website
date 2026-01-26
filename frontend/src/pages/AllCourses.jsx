import React, { useEffect, useState } from 'react'
import Nav from '../component/Nav'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import ai from "../assets/SearchAi.png"
import { useSelector } from 'react-redux'
import Card from '../component/Card'

function AllCourses() {
  const navigate = useNavigate()
  const { courseData } = useSelector(state => state.course)

  const [category, setCategory] = useState([])
  const [filterCourses, setFilterCourses] = useState([])
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(c => c !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let courseCopy = courseData?.slice() || []
    if (category.length > 0) {
      courseCopy = courseCopy.filter(c => category.includes(c.category))
    }
    setFilterCourses(courseCopy)
  }

  useEffect(() => {
    setFilterCourses(courseData)
  }, [courseData])

  useEffect(() => {
    applyFilter()
  }, [category, courseData])

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Nav />
      <button className='fixed top-20 left-4 z-50 bg-white
      text-black px-3 py-1 rounded md:hidden border-2
      border-black' onClick={()=>setIsSidebarVisible(prev=>!prev)} >
        {isSidebarVisible ? "Hide" : "Show"} Filters
      </button>

      {/* Sidebar */}
      <aside className={`w-[260px] h-screen fixed top-0 left-0 p-6 py-[130px] 
        bg-black border-r border-gray-200 shadow-md z-50 overflow-y-auto
        ${isSidebarVisible ? "translate-x-0" : '-translate-x-full'} md:block md:translate-x-0`}>
        <h2 className='text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6'>
          <FaArrowLeftLong className='text-white cursor-pointer' onClick={() => navigate('/')}  />
          Filter by Category
        </h2>

        <form onSubmit={(e) => e.preventDefault()} className='space-y-4 text-sm bg-gray-600 border-white text-white border p-[20px] rounded-2xl'>
          <button className='px-[10px] py-[10px] bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer'
          onClick={()=>navigate("/search")}>
            Search with AI <img src={ai} className='w-[30px] h-[30px] rounded-full' alt="" />
          </button>

          {['App Development','AI/ML','AI Tools','Data Science','Data Analytics','Ethical Hacking','UI/UX Development','Web Development','Others'].map((cat) => (
            <label key={cat} className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
              <input type="checkbox" className='accent-black w-4 h-4 rounded-md' value={cat} onChange={toggleCategory}/>
              {cat}
            </label>
          ))}
        </form>
      </aside>

      {/* Main content */}
      <main className='ml-[260px] w-full py-[130px] flex flex-wrap gap-6 px-6'>
        {filterCourses?.map((course) => (
          <Card
            key={course._id}
            thumbnail={course.thumbnail}
            title={course.title}
            category={course.category} // fixed typo
            price={course.price}
            id={course._id}
            reviews={course.reviews}
          />
        ))}
      </main>
    </div>
  )
}

export default AllCourses
