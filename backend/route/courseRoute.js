import express from 'express'
import { createCourse, createLecture, editCourses, editLecture, getCourseById, getCourseLecture, getCreatorById, getCreatorCourses, getPublishedCourses, removeCourse, removeLecture } from '../controllers/courseController.js'
import isAuth from '../middleware/isAuth.js'
import upload from '../middleware/multer.js'
import { searchWithAi } from '../controllers/searchController.js'

const courseRouter = express.Router()

courseRouter.post("/create", isAuth,  createCourse)
courseRouter.get("/getpublished", getPublishedCourses)
courseRouter.get("/getcreator", isAuth, getCreatorCourses)
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourses)
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById)
courseRouter.delete("/remove/:courseId", isAuth, removeCourse)

//for lectures
courseRouter.post("/createlecture/:courseId", isAuth, createLecture)
courseRouter.get("/courselecture/:courseId", isAuth, getCourseLecture)
courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture)
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture)
courseRouter.post("/creator", isAuth, getCreatorById)

//forsearch
courseRouter.post("/search", searchWithAi)

export default courseRouter