import React from 'react'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import{useState } from 'react'

const SearchBar = ({data}) => {

  const navigate = useNavigate()
  const [input, setinput] = useState(data ? data : "")
  const onSearchHandler = (e) => {
    e.preventDefault()
    navigate('/course-list/' + input)
    
  }
  
  return (
    
    <form onSubmit={onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex 
      items-center bg-white border border-gray-500/20 rounded '>
        <img src={assets.search_icon} alt="search_icon" className='md:w-auto w-10 px-3' />
      <input onChange={e => setinput(e.target.value)} value={ input}
        type="text" placeholder='Seacrh For Courses ' className='w-full h-full outline-none
        text-gray-500/80' />
        <button type='submit' className='bg-blue-600 text-white 
        rounded md:px-10 px-7 py-2 mx-1 md:py-3'>Search</button>
      </form>
  )
}

export default SearchBar