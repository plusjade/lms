class Concept < ActiveRecord::Base
  has_many :quiz_questions, class_name: "Quiz"

  def to_api
    {
      slug: slug,
      quiz_questions: quiz_questions.map{|a| a.to_api }.shuffle
    }
  end
end
