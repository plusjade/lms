class LessonsController < ApplicationController
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, :alert => exception.message
  end

  def index
    @lessons = Lesson.all
    authorize! :read, Lesson
  end

  def show
    @lesson = Lesson.where(lesson: params[:id].to_f ).first
    authorize! :read, @lesson
  end
end
