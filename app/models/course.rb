require 'securerandom'
class Course < ActiveRecord::Base
  has_many :lessons, dependent: :destroy
  has_and_belongs_to_many :teachers, through: :courses_users, association_foreign_key: :user_id
  has_and_belongs_to_many :students, through: :courses_users, association_foreign_key: :user_id
  has_many :attendances

  # validates_length_of :access_code, minimum: 10
  # validates_uniqueness_of :access_code, case_sensitive: true

  # The lead teacher's dropbox is used for all course materials.
  # For now, the lead is simply the first teacher added.
  def lead_teacher
    teacher = teachers.first
    raise ActiveRecord::NotFound unless teacher
    teacher
  end

  def to_api
    {
      id: id.to_s,
      name: name,
      lessons: lessons.map{ |a| a.to_api },
      calendar_embed: calendar_embed,
      url: Rails.application.routes.url_helpers.course_path(id)
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
