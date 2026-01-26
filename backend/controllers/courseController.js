import uploadOnCloudinary from "../config/cloudinary.js"
import Course from "../model/courseModel.js"
import Lecture from "../model/lectureModel.js"
import User from "../model/UserModel.js"


export const createCourse = async (req, res)=> {
    try {
        const {title, category} = req.body
        if(!title || !category){
            return res.status(400).json({message: "title or Category is required"})
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })
        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({message: `Course addition error ${error}`})
    }
}

export const getPublishedCourses = async(req, res)=> {
    try {
        const courses = await Course.find({isPublished: true}).populate("lectures reviews")
        if(!courses){
            return res.status(400).json({message: "Courses is not found"})
        }
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({message: `Failed to find the course ${error}`})
    }
}

export const getCreatorCourses = async(req, res)=> {
    try {
        const userId = req.userId
        const courses = await Course.find({creator: userId})
        if(!courses){
            return res.status(400).json({message: "Courses is not found"})
        }
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({message: `Failed to find the creator course ${error}`})
    }
}

export const editCourses = async(req, res)=> {
    try {
        const {courseId} = req.params
        const {title, subTitle, description, category, level,
            isPublished, price} = req.body
        let thumbnail
        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message: "Course is not found"})
        }
        const updateData = {title, subTitle, description, category, level,
            isPublished, price, thumbnail}
        course = await Course.findByIdAndUpdate(courseId, updateData, {new: true})
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message: `Failed to edit course ${error}`})
    }
}

export const getCourseById = async(req, res)=> {
    try {
        const {courseId} = req.params
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message: "Course is not found"})
        }
         return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message: `Failed to fetch course ${error}`})
    }
}

export const removeCourse = async(req, res)=> {
    try {
        const {courseId} = req.params
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message: "Course is not found"})
        }
        course = await Course.findByIdAndDelete(courseId, {new: true})
        return res.status(200).json({message: "Course removed"})
    } catch (error) {
        return res.status(500).json({message: `Failed to delete course ${error}`})
    }
}

//for lecture

export const createLecture = async(req, res) => {
    try {
        const {lectureTitle} = req.body
        const {courseId} = req.params
        if(!lectureTitle || !courseId){
            return res.status(400).json({message: "lectureTitle is required"})
        }
        const lecture = await Lecture.create({lectureTitle})
        const course = await Course.findById(courseId)
        if(course){
            course.lectures.push(lecture._id)
        }
        await course.populate("lectures")
        await course.save()
        return res.status(201).json({lecture, course})
    } catch (error) {
        return res.status(500).json({message: `Failed to create lecture ${error}`})
    }
}

export const getCourseLecture = async(req, res)=> {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message: "Course is not found"})
        }

        await course.populate("lectures")
        await course.save()
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message: `Failed to getCourseLecture ${error}`})
    }
}

export const editLecture = async(req, res) => {
    try {
        const {lectureId} = req.params
        const {isPreviewFree, lectureTitle} = req.body
        const lecture = await Lecture.findById(lectureId)
        if(!lecture){
            return res.status(404).json({message: "Lecture is not found"})
        }
        let videoUrl
        if(req.file){
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }
        if(lectureTitle){
            lecture.lectureTitle = lectureTitle
        }
        lecture.isPreviewFree = isPreviewFree

        await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({message: `Failed to editLecture ${error}`})
    }
}

export const removeLecture = async(req, res) => {
    try {
        const {lectureId} = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if(!lecture){
            return res.status(404).json({message: "Lecture is not found"})
        }
        await Course.updateOne(
            {lectures: lectureId},
            {$pull: {lectures:lectureId}}
        )
        return res.status(200).json({message: "Lecture Removed"})
    } catch (error) {
        return res.status(500).json({message: `Failed to removeLecture ${error}`})
    }
}

//get Creator

export const getCreatorById = async(req, res) => {
    try {
        const {userId} = req.body

        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({message: "User is not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: `Failed to getCreator ${error}`})
    }
}