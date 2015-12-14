class Feedback < ActiveRecord::Base
  belongs_to :student, foreign_key: :user_id
  belongs_to :lesson

  validates_presence_of :student
  validates_presence_of :lesson

  def to_api
    {
      id: id.to_s,
      comments: comments,
      comprehension: comprehension,
      learned: learned,
      pace: pace,
      quality: quality,
      engagement: engagement,
      questions: questions,
      student_id: user_id.to_s
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
