class LessonsController < ApplicationController
  def index
    course = Course.find(params[:course_id].to_s)

    authorize! :read, course

    lessons = course.lessons.map{ |a| a.to_api }

    render json: { lessons: lessons }
  end

  def show
    @lesson = Lesson.find(params[:id])
    @course = @lesson.course

    authorize! :read, @lesson

    render template: "courses/show"
  end
end
