class EmailProcessor
  attr_reader :email

  def initialize(email)
    @email = email
  end

  def process
    return if email.from.blank?

    RawEmail.create!({
      from: email.from[:email],
      subject: email.subject,
      raw_text: email.raw_text,
      raw_html: (email.raw_html.presence || email.raw_body),
    })
  end
end
