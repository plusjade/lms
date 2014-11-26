class LessonsController < ApplicationController
  def index
    course = Course.find(params[:course_id].to_s)

    authorize! :read, course

    lessons = course.lessons.map{ |a| a.to_api }

    render json: { lessons: lessons }

  rescue CanCan::AccessDenied
    render json: { lessons: [] }, status: :unauthorized
  rescue Mongoid::Errors::DocumentNotFound
    render json: { lessons: [] }, status: :not_found
  end

  def show
    lesson = Lesson.find(params[:id])
    course = lesson.course

    @lesson_api = lesson.to_api
    @lesson_api[:course_name] = course.name
    @lesson_api[:course_id] = course.id.to_s

    authorize! :read, lesson

  rescue CanCan::AccessDenied
    render text: 'Unauthorized' , status: :unauthorized
  rescue Mongoid::Errors::DocumentNotFound
    render text: 'Not Found', status: :not_found
  end
end
