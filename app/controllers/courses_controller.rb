class CoursesController < ApplicationController
  def index
    if params[:teacher_id]
      teacher = Teacher.find(params[:teacher_id])
      authorize! :read, teacher

      courses = teacher.courses
    elsif params[:student_id]
      student = Student.find(params[:student_id])
      authorize! :read, student

      courses = student.courses
    else
      authorize! :manage, Course
      courses = Course.all
    end

    courses = courses.map{ |a| a.to_api }

    render json: { courses: courses }

  rescue CanCan::AccessDenied
    render json: { courses: [] }, status: :unauthorized
  rescue Mongoid::Errors::DocumentNotFound
    render json: { courses: [] }, status: :not_found
  end
end
