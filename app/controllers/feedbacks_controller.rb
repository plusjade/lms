class FeedbacksController < ApplicationController
  def show
    feedback = Feedback.where({
                          student_id: params[:student_id],
                          lesson_id: params[:id]
                        }).first

    render json: { feedback: (feedback ? feedback.to_api : {}) }
  end

  def update
    Feedback.find(params[:id]).set(allowed_feedback)

    render json: { status: "ok" }
  end

  private

  def allowed_feedback
    params[:feedback].permit(
      :comments,
      :comprehension,
      :learned,
      :pace,
      :quality,
      :engagement,
      :questions
    )
  end
end
