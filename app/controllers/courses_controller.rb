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

  def show
    @course = Course.find(params[:id])
    @lesson = @course.lessons.gte(date: Date.today).first

    authorize! :read, @course

  rescue CanCan::AccessDenied
    render text: 'Unauthorized' , status: :unauthorized
  rescue Mongoid::Errors::DocumentNotFound
    render text: 'Not Found', status: :not_found
  end

  def grant_access
    course = Course.find(params[:id])

    authorize! :join, course

    if course.access_code == params[:access_code]
      course.students << current_user
      if course.save
        redirect_to root_url
      else
        render text: 'There was a problem saving!', status: :not_acceptable
      end
    else
      render text: 'Invalid access code', status: :unauthorized
    end

  rescue CanCan::AccessDenied
    render text: 'Unauthorized', status: :unauthorized
  rescue Mongoid::Errors::DocumentNotFound
    render text: 'Course not found', status: :not_found
  end
end
