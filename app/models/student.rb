class Student < User
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :feedbacks, dependent: :destroy
  has_many :attendances, dependent: :destroy
  has_and_belongs_to_many :courses
end
