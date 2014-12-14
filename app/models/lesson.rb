class Lesson
  include Mongoid::Document
  has_many :feedbacks
  has_many :attendances
  belongs_to :course

  field :title, type: String
  field :date, type: Date
  field :lesson, type: Float
  field :week, type: Integer

  validates_presence_of :course

  def to_api
    {
      id: _id.to_s,
      title: title,
      lesson: lesson,
      date: date,
      date_human: date_human
    }
  end

  def date_human
    date ?
      date.strftime("%A, %B %d, %Y") :
      nil
  end
end
