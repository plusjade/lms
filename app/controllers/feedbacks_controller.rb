class FeedbacksController < ApplicationController
  respond_to :json

  rescue_from CanCan::AccessDenied do |exception|
    render json: { feedback: {} }, status: :unauthorized
  end

  rescue_from Mongoid::Errors::DocumentNotFound do |exception|
    render json: { feedback: {} }, status: :not_found
  end

  def show
    data = { student_id: params[:student_id], lesson_id: params[:id] }
    feedback = Feedback.where(data).first

    if feedback
      authorize! :read, feedback
    else
      feedback = Feedback.new(data)
      authorize! :create, feedback
      feedback.save!
    end

    render json: { feedback: feedback.to_api }
  end

  def update
    feedback = Feedback.find(params[:id])

    authorize! :read, feedback

    feedback.set(allowed_feedback)

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
