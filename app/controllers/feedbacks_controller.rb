class FeedbacksController < ApplicationController
  respond_to :json, :html

  def index
    lesson = Lesson.find(params[:lesson_id])
    authorize! :manage, lesson

    # Get this course's students as a dictionary.
    students = lesson.course.students
    students_dict = {}
    students.each do |student|
      students_dict[student.id.to_s] = student
    end
    total_members = students.count

    feedbacks = Feedback.where(lesson: lesson).entries
    student_ids = feedbacks.map { |a| a.student_id }

    feedbacks = feedbacks.map do |a|
      a.to_api.merge({
        student_name: students_dict[a.student_id.to_s] ?
                        students_dict[a.student_id.to_s].name :
                        ''
      })
    end

    # Get student's who haven't given feedback.
    missing = []
    if students.count > feedbacks.count
      students.delete_if{ |a| student_ids.include?(a.id) }
      missing = students.map{|a| a.name }
    end

    render json: {
                   feedbacks: feedbacks,
                   total_members: total_members,
                   missing: missing
                 }
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

    feedback.update_attributes(allowed_feedback)

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
