require 'securerandom'
class Course
  include Mongoid::Document

  has_many :lessons
  has_and_belongs_to_many :teachers
  has_and_belongs_to_many :students
  belongs_to :lead_teacher, class_name: "Teacher", inverse_of: :lead_courses

  field :name, type: String
  field :slug, type: String, default: -> { normalize_slug }

  field :access_code, type: String, default: -> { generate_access_code }

  validates_presence_of :lead_teacher
  validates_length_of :access_code, minimum: 10
  validates_uniqueness_of :access_code, case_sensitive: true

  def to_api
    {
      id: _id.to_s,
      name: name,
      lessons: lessons.map{ |a| a.to_api }
    }
  end

  def normalize_slug
    name.to_s.downcase.strip.gsub(/\s+/, '-')
  end

  def generate_access_code
    SecureRandom.urlsafe_base64(10)
  end
end
