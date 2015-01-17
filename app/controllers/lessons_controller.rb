class LessonsController < ApplicationController
  def index
    respond_to do |format|
      format.html do
        @course = Course.find(params[:course_id].to_s)
        @lesson = @course.lessons.gte(date: Date.today).first

        authorize! :read, @course

        render template: "courses/show"
      end
      format.json do
        course = Course.find(params[:course_id].to_s)

        authorize! :read, course

        lessons = course.lessons.map{ |a| a.to_api }

        render json: { lessons: lessons }
      end
    end
  end

  def show
    @lesson = Lesson.find(params[:id])
    @course = @lesson.course

    authorize! :read, @lesson

    render template: "courses/show"
  end
end
