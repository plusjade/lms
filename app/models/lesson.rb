class Lesson
  include Mongoid::Document
  has_many :feedbacks
  has_many :attendances

  field :title, type: String
  field :date, type: Date
  field :lesson, type: Float
  field :week, type: Integer

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

  def self.populate
    [
      "html basics|November 19, 2014",

      "css basics|November 24, 2014",

      "advaned css| December 1, 2014",
      "advaned css| December 3, 2014",

      "website lab| December 8, 2014",
      "intro to programming | December 10, 2014",

      "javascript basics | December 15, 2014",
      "javascript functions | December 17, 2014",

      "jquery introduction | January 5, 2015",
      "javascript arrays | January 7, 2015",

      "Review lab | January 12, 2015",
      "Refactoring Techniques | January 14, 2015",

      # "Refactoring Techniques | January 19, 2015",
      "Refactoring Techniques | January 21, 2015",

      "Refactoring Techniques | January 26, 2015",
      "Refactoring Techniques | January 28, 2015",

      "Refactoring Techniques | February 2, 2015",
      "Refactoring Techniques | February 4, 2015",

      "Refactoring Techniques | February 9, 2015",
      "Refactoring Techniques | February 11, 2015",

      # "Refactoring Techniques | February 16, 2015",
      "Refactoring Techniques | February 18, 2015",
    ].each_with_index.map do |data, i|

      title, date = data.split('|')
      title = title.strip
      date = date.strip

      create(title: title, date: date, lesson: (i+1))
    end
  end
end
