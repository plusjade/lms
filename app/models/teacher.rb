class Teacher < User
  has_and_belongs_to_many :courses
  has_many :lead_courses, class_name: "Course", inverse_of: :lead_teacher
end
