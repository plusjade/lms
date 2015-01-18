require 'securerandom'
class Course
  include Mongoid::Document

  has_many :lessons, dependent: :destroy
  has_and_belongs_to_many :teachers
  has_and_belongs_to_many :students
  has_many :attendances

  field :name, type: String
  field :slug, type: String, default: -> { normalize_slug }

  field :access_code, type: String, default: -> { generate_access_code }
  field :calendar_embed, type: String

  validates_length_of :access_code, minimum: 10
  validates_uniqueness_of :access_code, case_sensitive: true

  # The lead teacher's dropbox is used for all course materials.
  # For now, the lead is simply the first teacher added.
  def lead_teacher
    teacher = teachers.first
    raise Mongoid::Errors::DocumentNotFound.new(self.class, {}) unless teacher

    teacher
  end

  def to_api
    {
      id: _id.to_s,
      name: name,
      lessons: lessons.map{ |a| a.to_api },
      calendar_embed: calendar_embed,
      url: Rails.application.routes.url_helpers.course_path(_id)
    }
  end

  def normalize_slug
    name.to_s.downcase.strip.gsub(/\s+/, '-')
  end

  def generate_access_code
    SecureRandom.urlsafe_base64(10)
  end

  def grant_access_path
    Rails.application.routes.url_helpers.grant_access_course_path(id, access_code)
  end
end
