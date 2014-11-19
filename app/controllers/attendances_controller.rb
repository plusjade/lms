class AttendancesController < ApplicationController

  # admin
  # /lessons/1/attendances
  def attendances
    lesson = Lesson.where(lesson: params[:id].to_f ).first
    attendances = Attendance.where(lesson: lesson).map do |a|
      {
        id: a.id.to_s,
        attended: a.attended,
        student_name: a.student.name,
        student_avatar: a.student.avatar
      }
    end

    render json: { attendances: attendances }
  end

  def update
    Attendance.find(params[:id]).set(attended: (params[:attended] == 'true'))

    render json: { status: "ok" }
  end
end
