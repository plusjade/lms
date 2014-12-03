class HomeController < ApplicationController
  def index
    if current_user
      @courses = current_user.courses
      if @courses.count == 1
        redirect_to course_path(@courses.first)
      end
    else
      render template: "home/login"
    end
  end
end
