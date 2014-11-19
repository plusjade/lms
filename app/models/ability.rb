class Ability
  include CanCan::Ability

  def initialize(user)
    if user
      can :read, Lesson
      can :manage, Feedback, student: user
    end
  end
end
