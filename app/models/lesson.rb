class Lesson < ActiveRecord::Base
  has_many :feedbacks
  has_many :attendances
  belongs_to :course

  validates_presence_of :course

  def to_api
    {
      id: id.to_s,
      title: title,
      lesson: lesson,
      date: date,
      date_human: date_human,
      url: Rails.application.routes.url_helpers.lesson_path(id)
    }
  end

  def date_human
    date ?
      date.strftime("%a %b %d, %Y") :
      nil
  end
end
