class Teacher < User
  has_and_belongs_to_many :courses, through: :courses_users, foreign_key: :user_id
end
