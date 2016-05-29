class EmailProcessor
  attr_reader :email

  def initialize(email)
    @email = email
  end

  def process
    return if email.from.blank?
  end
end
