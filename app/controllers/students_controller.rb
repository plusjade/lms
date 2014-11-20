class StudentsController < ApplicationController

  def new
    redirect_to lesson_path(1) if current_user
  end

  def create
    redirect_to lesson_path(1) if current_user

    student = Student.new(name: params[:student][:name])
    if student.valid?

      student.save!
      session[:user_id] = student.id.to_s

      redirect_to lesson_path(1)
    else
      redirect_to action: :new
    end
  end
end
