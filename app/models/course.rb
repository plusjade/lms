class Course
  include Mongoid::Document

  has_many :lessons
  has_and_belongs_to_many :teachers
  has_and_belongs_to_many :students

  field :name, type: String
  field :slug, type: String, default: -> { normalize_slug }

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
end
