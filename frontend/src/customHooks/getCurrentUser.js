import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { serverUrl } from '../App'
import axios from 'axios'

const getCurrentUser = () => {
    const dispatch = useDispatch()
  useEffect(()=> {
    const fetchUser = async() => {
        try {
            const result = await axios.get(serverUrl + "/api/user/getcurrentuser", {withCredentials: true})
            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }
    fetchUser()
  }, [])
}

export default getCurrentUser
