class CoursesController < ApplicationController
  def index
    if params[:teacher_id]
      teacher = Teacher.find(params[:teacher_id])
      authorize! :read, teacher

      courses = teacher.courses
    elsif params[:student_id]
      student = Student.find(params[:student_id])
      authorize! :read, student

      courses = student.courses
    else
      authorize! :manage, Course
      courses = Course.all
    end

    courses = courses.map{ |a| a.to_api }

    render json: { courses: courses }
  end

  def show
    @course = Course.find(params[:id])
    @lesson = @course.lessons.gte(date: Date.today).first

    authorize! :read, @course
  end

  def grant_access
    course = Course.find(params[:id])

    authorize! :join, course

    if course.student_ids.include?(current_user.id)
      redirect_to root_url
    else
      if course.access_code == params[:access_code]
        course.students << current_user
        if course.save
          redirect_to root_url
        else
          render text: 'There was a problem saving!', status: :not_acceptable
        end
      else
        render text: 'Invalid access code', status: :unauthorized
      end
    end
  end
end
