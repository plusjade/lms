class Attendance
  include Mongoid::Document

  belongs_to :student
  belongs_to :lesson

  field :attended, type: Boolean, default: false
  field :excused, type: Boolean, default: false
  field :reason, type: String

  def self.populate
    student_first = Student.first
    student_last = Student.last
    Lesson.all.each do |lesson|
      create({
        student: student_first,
        lesson: lesson,
        attended: [true, false].sample,
      })
      create({
        student: student_last,
        lesson: lesson,
        attended: [true, false].sample,
      })
    end
  end
end
