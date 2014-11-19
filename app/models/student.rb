class Student < User
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :feedbacks
  has_many :attendances
end
