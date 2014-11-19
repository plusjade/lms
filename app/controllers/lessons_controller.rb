class LessonsController < ApplicationController
  def index
  end

  def show
    @lesson = Lesson.where(lesson: params[:id].to_f ).first
  end
end
