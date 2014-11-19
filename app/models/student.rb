class Student
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :feedbacks
  has_many :attendances

  field :name, type: String
  field :email, type: String
  field :avatar, type: String
end
