class QuestionsController < ApplicationController

  def check
    quiz = Quiz.find(params[:id])
    if quiz.answer == params[:choice]
      render json: {status: "ok"}
    else
      head status: 400
    end
  end
end
