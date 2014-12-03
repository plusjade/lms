class FeedbacksController < ApplicationController
  respond_to :json, :html

  def index
    lesson = Lesson.find(params[:lesson_id])
    authorize! :manage, lesson
    feedbacks = Feedback.where(lesson: lesson).entries

    student_ids = feedbacks.map { |a| a.student_id }
    students_dict = {}
    Student.where(id: { "$in" => student_ids }).each do |student|
      students_dict[student.id.to_s] = student
    end

    feedbacks = feedbacks.map do |a|
      a.to_api.merge({
        student_name: students_dict[a.student_id.to_s] ?
                        students_dict[a.student_id.to_s].name :
                        ''
      })
    end

    render json: { feedbacks: feedbacks }
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
