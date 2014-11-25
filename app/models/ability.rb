class Ability
  include CanCan::Ability

  def initialize(user)
    case user
    when Teacher
      can :manage, :all
      cannot :join, Course # cannot join as student
    when Student
      can :read, Lesson do |lesson|
        user.course_ids.include?(lesson.course_id)
      end
      can :manage, Feedback, student: user
      can :manage, Student, id: user.id
      can :join, Course
    end
  end
end
