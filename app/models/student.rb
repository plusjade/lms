class Student < User
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :feedbacks, dependent: :destroy
  has_many :attendances, dependent: :destroy
end
