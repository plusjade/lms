class StudentsController < ApplicationController
  def index
    course = Course.find(params[:course_id].to_s)
    authorize! :read, course

    students = course.students.map{ |a| a.to_api }

    render json: { students: students }
  end
end
