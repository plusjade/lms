class Feedback
  include Mongoid::Document
  belongs_to :student
  belongs_to :lesson

  field :comprehension, type: Integer
  field :engagement, type: Integer
  field :quality, type: Integer
  field :pace, type: Integer

  field :learned, type: String
  field :comments, type: String
  field :questions, type: String

  def to_api
    {
      id: _id.to_s,
      comments: comments,
      comprehension: comprehension,
      learned: learned,
      pace: pace,
      quality: quality,
      engagement: engagement,
      questions: questions
    }
  end

  def self.populate
    student_first = Student.first
    student_last = Student.last
    Lesson.all.each do |lesson|
      Feedback.create({
        student: student_first,
        lesson: lesson,
        comprehension: (1..5).to_a.sample,
        quality: (1..5).to_a.sample,
        pace: (1..5).to_a.sample,
        learned: "Basics of HTML and the history of websites and the web browser."
      })
      Feedback.create({
        student: student_last,
        lesson: lesson,
        comprehension: (1..5).to_a.sample,
        quality: (1..5).to_a.sample,
        pace: (1..5).to_a.sample,
        learned: "Basics of HTML and the history of websites and the web browser."
      })
    end
  end
end
