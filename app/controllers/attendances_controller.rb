class AttendancesController < ApplicationController

  # admin
  # /lessons/1/attendances
  def attendances
    lesson = Lesson.find(params[:id])
    authorize! :manage, lesson

    students = lesson.course.students

    attendances = Attendance.where(lesson: lesson).entries
    attendances_student_dict = {}
    attendances.each do |a|
      attendances_student_dict[a.student_id.to_s] = a
    end

    data = students.map do |student|
      a = attendances_student_dict[student.id.to_s]
      a ||= student.attendances.create!(lesson: lesson)

      {
        id: a.id.to_s,
        attended: a.attended,
        student_name: student.name,
        student_avatar: student.avatar
      }
    end


    render json: { attendances: data }
  end

  def update
    attendance = Attendance.find(params[:id])
    authorize! :manage, attendance

    attendance.set(attended: (params[:attended] == 'true'))

    render json: { status: "ok" }
  end
end
