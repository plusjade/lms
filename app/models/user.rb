class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :email, type: String
  field :avatar, type: String

  field :uid, type: String
  field :provider, type: String

  validates_presence_of :name

  def to_api
    {
      id: _id.to_s,
      type: _type,
      name: name,
      email: email,
      avatar: avatar
    }
  end

  def self.find_or_create_from_omniauth(auth)
    where({
        provider: auth['provider'],
        uid: auth['uid'].to_s,
        token: auth.credentials.token
    }).first || create_with_omniauth(auth)
  end

  def self.create_from_omniauth(auth)
    create! do |s|
      s.provider = auth['provider']
      s.uid = auth['uid']
      if auth['info']
         user.name = auth['info']['name'] || ""
         user.email = auth['info']['email'] || ""
      end
    end
  end
end
