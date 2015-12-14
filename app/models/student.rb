class Student < User
  has_many :feedbacks, dependent: :destroy
  has_many :attendances, dependent: :destroy
  has_and_belongs_to_many :courses, through: :courses_users, foreign_key: :user_id
end
