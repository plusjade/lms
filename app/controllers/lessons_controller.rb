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
    @lesson = Lesson.where(lesson: params[:id].to_f ).first
    authorize! :read, @lesson

  rescue CanCan::AccessDenied, Mongoid::Errors::DocumentNotFound.new(StandardError, {})
    render text: "Not Found", status: :not_found
  end
end
