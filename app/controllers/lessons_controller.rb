class LessonsController < ApplicationController
  def index
    lessons = Lesson.all
    authorize! :read, Lesson

    lessons = lessons.map{ |a| a.to_api }

    render json: { lessons: lessons }

  rescue CanCan::AccessDenied, Mongoid::Errors::DocumentNotFound.new(StandardError, {})
    render json: { lessons: [] }, status: :not_found
  end

  def show
    @lesson = Lesson.where(lesson: params[:id].to_f ).first
    authorize! :read, @lesson

  rescue CanCan::AccessDenied, Mongoid::Errors::DocumentNotFound.new(StandardError, {})
    render text: "Not Found", status: :not_found
  end
end
