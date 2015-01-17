class StudentsController < ApplicationController
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

        students = course.students.map{ |a| a.to_api }

        render json: { students: students }
      end
    end
  end
end
