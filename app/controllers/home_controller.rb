class HomeController < ApplicationController
  def index
    @courses = current_user.courses
    if @courses.count == 1
      redirect_to course_path(@courses.first)
    end
  end
end
