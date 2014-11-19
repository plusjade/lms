class Ability
  include CanCan::Ability

  def initialize(user)
    case user
    when Teacher
      can :manage, :all
    when Student
      can :read, Lesson
      can :manage, Feedback, student: user
    end
  end
end
