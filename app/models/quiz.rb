class Quiz < ActiveRecord::Base
  def to_api
    {
      id: id,
      question: question,
      choices: choices.shuffle
    }
  end

  def answer
    choices.first
  end
end
